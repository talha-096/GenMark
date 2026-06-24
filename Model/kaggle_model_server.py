import os
import io
import base64
import glob
import threading
import time
from PIL import Image
import requests as req_lib
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from pyngrok import ngrok, conf

# ==========================================
# STEP 1: CONFIGURATION & CREDENTIALS
# ==========================================

# Setup Ngrok Auth Token
try:
    from kaggle_secrets import UserSecretsClient
    _secrets = UserSecretsClient()
    NGROK_TOKEN = _secrets.get_secret('NGROK_AUTH_TOKEN')
    print('[OK] ngrok token loaded from Kaggle Secrets')
except Exception:
    NGROK_TOKEN = os.environ.get('NGROK_AUTH_TOKEN', '')
    if NGROK_TOKEN:
        print('[OK] ngrok token loaded from environment variable')
    else:
        print('[WARN] NGROK_AUTH_TOKEN not set — ngrok tunnel will fail!')

# ── Auto-Detect Dataset base path ──────
possible_bases = [
    '/kaggle/input/genmark-local-models',
    '/kaggle/input/datasets/talha096/genmark-local-models',
]

DATASET_BASE = None
for base in possible_bases:
    if os.path.exists(os.path.join(base, 'Text to image Model')):
        DATASET_BASE = base
        break

if DATASET_BASE is None:
    matches = glob.glob('/kaggle/input/**/Text to image Model', recursive=True)
    if matches:
        DATASET_BASE = os.path.dirname(matches[0])
        print(f'[OK] Auto-detected dataset base path: {DATASET_BASE}')
    else:
        DATASET_BASE = '/kaggle/input/datasets/talha096/genmark-local-models'
        print(f'[WARN] Could not auto-detect dataset. Falling back to: {DATASET_BASE}')
else:
    print(f'[OK] Resolved dataset base path: {DATASET_BASE}')

TEXT_TO_TEXT_PATH  = os.path.join(DATASET_BASE, 'Text to text Model')
TEXT_TO_IMAGE_PATH = os.path.join(DATASET_BASE, 'Text to image Model')
IMAGE_TO_TEXT_PATH = os.path.join(DATASET_BASE, 'Image to text Model')

print(f'Text-to-Text   -> {TEXT_TO_TEXT_PATH}')
print(f'Text-to-Image  -> {TEXT_TO_IMAGE_PATH}')
print(f'Image-to-Text  -> {IMAGE_TO_TEXT_PATH}')

# ==========================================
# STEP 2: PATCHES (for model compatibility)
# ==========================================
nn.Module._supports_sdpa = False

if not hasattr(torch, '_is_linspace_patched'):
    old_linspace = torch.linspace
    def patched_linspace(*args, **kwargs):
        if kwargs.get('device') is None or kwargs.get('device') == 'meta':
            kwargs['device'] = 'cpu'
        return old_linspace(*args, **kwargs)
    torch.linspace = patched_linspace
    torch._is_linspace_patched = True

import transformers
from transformers import PreTrainedTokenizerBase
try:
    from transformers import PreTrainedTokenizerFast
except ImportError:
    PreTrainedTokenizerFast = None

def safe_additional_special_tokens(self):
    try:
        if hasattr(self, '_tokenizer') and hasattr(self._tokenizer, 'additional_special_tokens'):
            return self._tokenizer.additional_special_tokens
    except Exception:
        pass
    return getattr(self, '_additional_special_tokens', [])

PreTrainedTokenizerBase.additional_special_tokens = property(safe_additional_special_tokens)
if PreTrainedTokenizerFast is not None:
    PreTrainedTokenizerFast.additional_special_tokens = property(safe_additional_special_tokens)

from transformers.configuration_utils import PretrainedConfig
PretrainedConfig.forced_bos_token_id = None

try:
    from transformers.modeling_utils import PreTrainedModel
    PreTrainedModel._supports_sdpa = False
except Exception:
    pass

import transformers.dynamic_module_utils as dynamic_utils
if hasattr(dynamic_utils, 'get_class_from_dynamic_module') and not hasattr(dynamic_utils, '_is_class_loader_patched'):
    old_get_class = dynamic_utils.get_class_from_dynamic_module
    def patched_get_class(*args, **kwargs):
        cls = old_get_class(*args, **kwargs)
        if cls.__name__ == 'Florence2Processor':
            old_init = cls.__init__
            def new_init(self, *iargs, **ikwargs):
                valid_kwargs = {}
                if 'image_processor' in ikwargs:
                    valid_kwargs['image_processor'] = ikwargs['image_processor']
                if 'tokenizer' in ikwargs:
                    valid_kwargs['tokenizer'] = ikwargs['tokenizer']
                return old_init(self, *iargs, **valid_kwargs)
            cls.__init__ = new_init
        elif cls.__name__ == 'Florence2ForConditionalGeneration':
            cls._supports_sdpa = False
        return cls
    dynamic_utils.get_class_from_dynamic_module = patched_get_class
    dynamic_utils._is_class_loader_patched = True

def patch_tokenizers_backend(cls, visited=None):
    if visited is None:
        visited = set()
    if cls in visited:
        return
    visited.add(cls)
    if 'TokenizersBackend' in cls.__name__:
        try:
            cls.additional_special_tokens = property(safe_additional_special_tokens)
        except Exception:
            pass
    try:
        subclasses = cls.__subclasses__()
    except Exception:
        subclasses = []
    for sub in subclasses:
        patch_tokenizers_backend(sub, visited)

try:
    patch_tokenizers_backend(object)
except Exception:
    pass

# ==========================================
# STEP 3: LOAD ALL LOCAL MODELS
# ==========================================
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
DTYPE  = torch.float16 if torch.cuda.is_available() else torch.float32
print(f'\n[INFO] Device: {DEVICE} | Dtype: {DTYPE}')

from transformers import AutoModelForCausalLM, AutoProcessor, AutoTokenizer
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, DPMSolverMultistepScheduler

# ── Text-to-Text: Local Gemma/GenMark model ──
print('\n[LOAD] Loading Text-to-Text (GenMark / Gemma fine-tuned)...')
text_tokenizer = AutoTokenizer.from_pretrained(TEXT_TO_TEXT_PATH)
text_model = AutoModelForCausalLM.from_pretrained(
    TEXT_TO_TEXT_PATH,
    torch_dtype=DTYPE,
    device_map='auto' if torch.cuda.is_available() else None,
)
if not torch.cuda.is_available():
    text_model = text_model.to(DEVICE)
text_model.eval()
print('[OK] Text-to-Text model loaded!')

# ── Text-to-Image: Stable Diffusion ──
print('\n[LOAD] Loading Text-to-Image (Stable Diffusion)...')
sd_pipeline = StableDiffusionPipeline.from_pretrained(
    TEXT_TO_IMAGE_PATH,
    torch_dtype=DTYPE,
    safety_checker=None
)
config_dict = dict(sd_pipeline.scheduler.config)
for key in ["algorithm_type", "solver_type", "final_sigmas_type"]:
    config_dict.pop(key, None)
sd_pipeline.scheduler = DPMSolverMultistepScheduler.from_config(config_dict, use_karras_sigmas=True)
sd_pipeline = sd_pipeline.to(DEVICE)
sd_pipeline.enable_attention_slicing()

# ── Image-to-Image: reuse Stable Diffusion components ──
print('\n[LOAD] Creating Image-to-Image Pipeline...')
try:
    sd_img2img_pipeline = StableDiffusionImg2ImgPipeline(**sd_pipeline.components).to(DEVICE)
except Exception:
    sd_img2img_pipeline = StableDiffusionImg2ImgPipeline(
        vae=sd_pipeline.vae,
        text_encoder=sd_pipeline.text_encoder,
        tokenizer=sd_pipeline.tokenizer,
        unet=sd_pipeline.unet,
        scheduler=sd_pipeline.scheduler,
        safety_checker=None,
        feature_extractor=None,
        requires_safety_checker=False
    ).to(DEVICE)
sd_img2img_pipeline.enable_attention_slicing()
print('[OK] Text-to-Image & Image-to-Image pipelines loaded!')

# ── Image-to-Text: Florence-2 ──
print('\n[LOAD] Loading Image-to-Text (Florence-2)...')
try:
    patch_tokenizers_backend(object)
except Exception:
    pass
florence_processor = AutoProcessor.from_pretrained(IMAGE_TO_TEXT_PATH, trust_remote_code=True)
florence_model = AutoModelForCausalLM.from_pretrained(
    IMAGE_TO_TEXT_PATH,
    torch_dtype=DTYPE,
    trust_remote_code=True,
    attn_implementation="eager"
).to(DEVICE)
florence_model.eval()
print('[OK] Image-to-Text model loaded!')

print('\n' + '=' * 60)
print('All models ready — 100% LOCAL (no external API keys)!')
print('  Text-to-Text   -> GenMark (Gemma fine-tuned, local GPU)')
print('  Text-to-Image  -> Stable Diffusion (local GPU)')
print('  Image-to-Image -> Stable Diffusion (local GPU)')
print('  Image-to-Text  -> Florence-2 (local GPU)')
print('=' * 60)

# ==========================================
# STEP 4: FLASK WEB SERVER
# ==========================================
app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'device': DEVICE,
        'models': [
            'genmark-gemma (text, local)',
            'stable-diffusion (txt2img, local)',
            'stable-diffusion (img2img, local)',
            'florence-2 (img2text, local)'
        ]
    })

@app.route('/generate-text', methods=['POST'])
def generate_text():
    """Text generation via LOCAL GenMark (Gemma fine-tuned) model"""
    data = request.json or {}
    prompt = data.get('prompt', '')
    system_prompt = data.get('system_prompt', 'You are a helpful marketing assistant.')
    max_tokens = int(data.get('max_tokens', 500))
    temperature = float(data.get('temperature', 0.7))

    if not prompt:
        return jsonify({'error': 'prompt is required'}), 400

    try:
        # Build the input using Gemma's chat-style turn format
        full_prompt = (
            f"<start_of_turn>user\n"
            f"System: {system_prompt}\n\n"
            f"{prompt}<end_of_turn>\n"
            f"<start_of_turn>model\n"
        )

        inputs = text_tokenizer(full_prompt, return_tensors='pt').to(DEVICE)
        input_length = inputs['input_ids'].shape[1]

        with torch.no_grad():
            outputs = text_model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                temperature=max(temperature, 0.01),  # Avoid 0
                top_p=0.9,
                top_k=50,
                do_sample=True,
                repetition_penalty=1.15,
                pad_token_id=text_tokenizer.pad_token_id or text_tokenizer.eos_token_id,
            )

        # Decode only the NEW tokens (skip the input prompt)
        generated_ids = outputs[0][input_length:]
        content = text_tokenizer.decode(generated_ids, skip_special_tokens=True).strip()

        # Clean any trailing turn markers
        for marker in ['<end_of_turn>', '<start_of_turn>', '<eos>', '<bos>']:
            content = content.replace(marker, '').strip()

        return jsonify({'content': content, 'model': 'genmark-gemma-local'})
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/generate-image', methods=['POST'])
def generate_image():
    """Text-to-Image via LOCAL Stable Diffusion model"""
    data = request.json or {}
    prompt = data.get('prompt', '')
    negative_prompt = data.get('negative_prompt', '')
    steps = int(data.get('steps', 25))
    width = int(data.get('width', 512))
    height = int(data.get('height', 512))

    if not prompt:
        return jsonify({'error': 'prompt is required'}), 400

    try:
        with torch.no_grad():
            result = sd_pipeline(
                prompt,
                negative_prompt=negative_prompt,
                num_inference_steps=steps,
                width=width,
                height=height
            )
        image = result.images[0]
        buf = io.BytesIO()
        image.save(buf, format='PNG')
        return jsonify({
            'image_base64': base64.b64encode(buf.getvalue()).decode('utf-8'),
            'model': 'stable-diffusion-genmark'
        })
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/image-to-image', methods=['POST'])
def image_to_image():
    """Image editing via LOCAL Stable Diffusion img2img pipeline"""
    data = request.json or {}
    image_base64 = data.get('image_base64', '')
    image_url = data.get('image_url', '')
    prompt = data.get('prompt', '')
    negative_prompt = data.get('negative_prompt', '')
    strength = float(data.get('strength', 0.75))
    steps = int(data.get('steps', 25))

    if not prompt:
        return jsonify({'error': 'prompt is required'}), 400
    if not image_base64 and not image_url:
        return jsonify({'error': 'image data required'}), 400

    try:
        if image_base64:
            image_bytes = base64.b64decode(image_base64)
            init_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        else:
            resp = req_lib.get(image_url, timeout=30)
            init_image = Image.open(io.BytesIO(resp.content)).convert('RGB')

        init_image = init_image.resize((512, 512))

        with torch.no_grad():
            result = sd_img2img_pipeline(
                prompt=prompt,
                image=init_image,
                negative_prompt=negative_prompt,
                num_inference_steps=steps,
                strength=strength
            )
        output_image = result.images[0]
        buf = io.BytesIO()
        output_image.save(buf, format='PNG')
        return jsonify({
            'image_base64': base64.b64encode(buf.getvalue()).decode('utf-8'),
            'model': 'stable-diffusion-img2img-genmark'
        })
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/image-to-text', methods=['POST'])
def image_to_text():
    """Image analysis via LOCAL Florence-2 model"""
    data = request.json or {}
    image_url = data.get('image_url', '')
    image_base64 = data.get('image_base64', '')
    task = data.get('prompt', '<DETAILED_CAPTION>')

    valid_tasks = [
        '<CAPTION>', '<DETAILED_CAPTION>', '<MORE_DETAILED_CAPTION>',
        '<OD>', '<DENSE_REGION_CAPTION>', '<REGION_PROPOSAL>',
        '<OCR>', '<OCR_WITH_REGION>'
    ]
    if not (task in valid_tasks or task.startswith('<VQA>')):
        task = '<DETAILED_CAPTION>'
    if not image_url and not image_base64:
        return jsonify({'error': 'image data required'}), 400

    try:
        if image_base64:
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        else:
            resp = req_lib.get(image_url, timeout=30)
            image = Image.open(io.BytesIO(resp.content)).convert('RGB')

        inputs = florence_processor(text=task, images=image, return_tensors='pt').to(DEVICE, DTYPE)
        with torch.no_grad():
            generated_ids = florence_model.generate(
                input_ids=inputs['input_ids'],
                pixel_values=inputs['pixel_values'],
                max_new_tokens=512,
                num_beams=3
            )
        generated_text = florence_processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

        parse_task = '<VQA>' if task.startswith('<VQA>') else task
        parsed = florence_processor.post_process_generation(
            generated_text, task=parse_task, image_size=(image.width, image.height)
        )
        content = parsed.get(parse_task, generated_text)
        return jsonify({
            'content': str(content) if isinstance(content, dict) else content,
            'model': 'florence-2-genmark'
        })
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# ==========================================
# STEP 5: NGROK TUNNEL & SERVER RUN
# ==========================================
conf.get_default().auth_token = NGROK_TOKEN
ngrok.kill()
PORT = 8080

flask_thread = threading.Thread(
    target=lambda: app.run(host='0.0.0.0', port=PORT, use_reloader=False, threaded=True),
    daemon=True
)
flask_thread.start()
time.sleep(2)

try:
    tunnel = ngrok.connect(PORT, 'http', hostname='aurelia-duodecastyle-conchita.ngrok-free.dev')
    PUBLIC_URL = tunnel.public_url
except Exception as e:
    print(f"[WARN] Failed to connect to custom hostname: {e}")
    print("[INFO] Starting ngrok tunnel with a random subdomain...")
    tunnel = ngrok.connect(PORT, 'http')
    PUBLIC_URL = tunnel.public_url

print('=' * 60)
print(f'ngrok tunnel URL: {PUBLIC_URL}')
print('=' * 60)
print('\nCOPY THE URL ABOVE and paste it into your backend .env file:')
print(f'   KAGGLE_MODEL_URL={PUBLIC_URL}\n')

print('Server is running. Status will be printed every 5 minutes...')
keep_running = True
iteration = 0

while keep_running:
    try:
        iteration += 1
        r = req_lib.get(f'http://localhost:{PORT}/health', timeout=5)
        print(f'[{iteration * 5:4d} min] OK Server {r.json().get("status", "unknown")} | URL: {PUBLIC_URL}')
    except Exception as e:
        print(f'[{iteration * 5:4d} min] WARN {e}')
    time.sleep(300)
