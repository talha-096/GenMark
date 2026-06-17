import os
import io
import base64
import threading
import time
from PIL import Image
import requests as req_lib
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok, conf

# Install google-genai package automatically if not present
try:
    from google import genai
    from google.genai import types
except ImportError:
    print("[INFO] Installing google-genai library...")
    os.system("pip install -q google-genai")
    from google import genai
    from google.genai import types

# ==========================================
# STEP 1: CONFIGURATION & CREDENTIALS
# ==========================================
# Setup Gemini API key
GEMINI_API_KEY = "AIzaSyDr94kmVSicb0EPvKgceDXgXv6p4xasNWo"
client = genai.Client(api_key=GEMINI_API_KEY)
print("[OK] Gemini API Client initialized successfully!")

# Setup Ngrok Auth Token
try:
    from kaggle_secrets import UserSecretsClient
    secrets = UserSecretsClient()
    NGROK_TOKEN = secrets.get_secret('NGROK_AUTH_TOKEN')
    print('[OK] ngrok token loaded from Kaggle Secrets')
except Exception:
    # Hardcoded fallback
    NGROK_TOKEN = '3BnR5jH3mHvw2BcS28rTHldeEPz_6dsDVyQEUxsbLtA4DLe1m'
    print('[WARN] Using hardcoded ngrok token -- use Kaggle Secrets in production!')

# ==========================================
# STEP 2: FLASK WEB SERVER
# ==========================================
app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok', 
        'device': 'cloud-gemini', 
        'models': ['gemini-2.5-flash', 'imagen-3.0-generate-002']
    })

@app.route('/generate-text', methods=['POST'])
def generate_text():
    data = request.json or {}
    prompt = data.get('prompt', '')
    system_prompt = data.get('system_prompt', 'You are a helpful marketing assistant.')
    max_tokens = int(data.get('max_tokens', 500))
    temperature = float(data.get('temperature', 0.7))

    if not prompt: 
        return jsonify({'error': 'prompt is required'}), 400

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=temperature,
                max_output_tokens=max_tokens
            )
        )
        return jsonify({'content': response.text, 'model': 'gemini-2.5-flash'})
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json or {}
    prompt = data.get('prompt', '')
    width = int(data.get('width', 512))
    height = int(data.get('height', 512))

    if not prompt: 
        return jsonify({'error': 'prompt is required'}), 400

    # Determine closest aspect ratio for Imagen 3
    aspect_ratio = '1:1'
    if width > height:
        if width / height >= 1.5:
            aspect_ratio = '16:9'
        else:
            aspect_ratio = '4:3'
    elif height > width:
        if height / width >= 1.5:
            aspect_ratio = '9:16'
        else:
            aspect_ratio = '3:4'

    try:
        response = client.models.generate_images(
            model='imagen-3.0-generate-002',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                output_mime_type='image/png',
                aspect_ratio=aspect_ratio
            )
        )
        image = response.generated_images[0].image
        
        # Encode image to Base64
        buf = io.BytesIO()
        image.save(buf, format='PNG')
        return jsonify({
            'image_base64': base64.b64encode(buf.getvalue()).decode('utf-8'), 
            'model': 'imagen-3.0-generate-002'
        })
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/image-to-image', methods=['POST'])
def image_to_image():
    data = request.json or {}
    image_base64 = data.get('image_base64', '')
    image_url = data.get('image_url', '')
    prompt = data.get('prompt', '')

    if not prompt: 
        return jsonify({'error': 'prompt is required'}), 400
    if not image_base64 and not image_url: 
        return jsonify({'error': 'image data required'}), 400

    try:
        # Load image via Base64 or Fallback URL
        if image_base64:
            image_bytes = base64.b64decode(image_base64)
            init_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        else:
            resp = req_lib.get(image_url, timeout=30)
            init_image = Image.open(io.BytesIO(resp.content)).convert('RGB')

        # 1. Use Gemini 2.5 Flash to describe the original image
        describe_prompt = (
            "Describe this image in detail, including layout, objects, colors, and style, "
            "so that a text-to-image model can recreate a similar visual."
        )
        desc_response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[init_image, describe_prompt]
        )
        image_description = desc_response.text

        # 2. Generate a new prompt merging the description and user edit prompt
        enhanced_prompt = (
            f"Based on this image description: '{image_description}'. "
            f"Modify the image according to this instruction: '{prompt}'. "
            "Produce a high-quality, professional marketing visual."
        )

        # 3. Generate the modified image using Imagen 3
        response = client.models.generate_images(
            model='imagen-3.0-generate-002',
            prompt=enhanced_prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                output_mime_type='image/png',
                aspect_ratio='1:1'
            )
        )
        image = response.generated_images[0].image
        
        # Encode image to Base64
        buf = io.BytesIO()
        image.save(buf, format='PNG')
        return jsonify({
            'image_base64': base64.b64encode(buf.getvalue()).decode('utf-8'), 
            'model': 'imagen-3.0-generate-002'
        })
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/image-to-text', methods=['POST'])
def image_to_text():
    data = request.json or {}
    image_url = data.get('image_url', '')
    image_base64 = data.get('image_base64', '')
    task = data.get('prompt', '<DETAILED_CAPTION>')

    if not image_url and not image_base64: 
        return jsonify({'error': 'image data required'}), 400

    # Map Florence-2 tags to Gemini prompts
    gemini_prompt = "Describe this image in detail."
    if task == '<CAPTION>':
        gemini_prompt = "Provide a short, concise, one-sentence caption for this image."
    elif task == '<DETAILED_CAPTION>':
        gemini_prompt = "Provide a detailed description of this image."
    elif task == '<MORE_DETAILED_CAPTION>':
        gemini_prompt = "Provide a highly detailed, comprehensive description of everything in this image."
    elif task == '<OCR>' or task == '<OCR_WITH_REGION>':
        gemini_prompt = "Extract and write all text visible in this image."
    elif task == '<OD>' or task == '<REGION_PROPOSAL>':
        gemini_prompt = "List all key objects visible in this image and their approximate locations."
    elif task == '<DENSE_REGION_CAPTION>':
        gemini_prompt = "Identify and describe the different regions and components of this image."
    elif task.startswith('<VQA>'):
        gemini_prompt = task.replace('<VQA>', '').strip()

    try:
        if image_base64:
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        else:
            resp = req_lib.get(image_url, timeout=30)
            image = Image.open(io.BytesIO(resp.content)).convert('RGB')

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[image, gemini_prompt]
        )
        
        return jsonify({'content': response.text, 'model': 'gemini-2.5-flash'})
    except Exception as e:
        import traceback; print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# ==========================================
# STEP 3: NGROK TUNNEL & SERVER RUN
# ==========================================
conf.get_default().auth_token = NGROK_TOKEN
ngrok.kill()
PORT = 8080

flask_thread = threading.Thread(target=lambda: app.run(host='0.0.0.0', port=PORT, use_reloader=False, threaded=True), daemon=True)
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
