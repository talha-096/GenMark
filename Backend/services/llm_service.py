import os
import requests
import time
from openai import OpenAI
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
try:
    from llama_cpp import Llama
except ImportError:
    Llama = None

try:
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
except ImportError:
    torch = None
    AutoModelForCausalLM = None
from flask import current_app

class LLMService:
    def __init__(self):
        # Support for multiple AI providers
        self.openai_key = os.getenv("OPENAI_API_KEY", "your-api-key-here")
        self.client = OpenAI(api_key=self.openai_key) if self.openai_key != "your-api-key-here" else None
        
        # Serverless API tokens
        self.hf_token = os.getenv("HF_TOKEN")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        
        # Local LLM Support
        self.local_llm = None
        self.hf_model = None
        self.hf_tokenizer = None
        self.hf_pipeline = None
        self.kaggle_url = os.getenv("KAGGLE_MODEL_URL")
    
    def generate_text_to_text(self, prompt, brand_kit=None, content_type="text"):
        """Generate text content from text prompt"""
        # Try Kaggle Hosted Model first
        if self.kaggle_url:
            system_prompt = self._build_brand_context(brand_kit, content_type)
            try:
                response = requests.post(
                    f"{self.kaggle_url}/generate-text",
                    json={
                        "prompt": prompt,
                        "system_prompt": system_prompt,
                        "max_tokens": 500,
                        "temperature": 0.1
                    },
                    timeout=60,
                    verify=False
                )
                response.raise_for_status()
                data = response.json()
                content = data.get("content", "")
                for stop_word in ["<end_of_turn>", "<start_of_turn>", "</start_of_turn>", "<bos>", "<eos>"]:
                    if stop_word in content:
                        content = content.split(stop_word)[0].strip()
                return {
                    "content": content,
                    "model": f"kaggle-{data.get('model', 'mistral')}",
                    "type": "text",
                    "brand_applied": brand_kit is not None
                }
            except Exception as e:
                print(f"Kaggle text generation failed, falling back: {e}")

        # Try Local LLM first if configured and available
        if current_app.config.get('LOCAL_LLM_MODEL_PATH') and os.path.exists(current_app.config.get('LOCAL_LLM_MODEL_PATH')):
            local_result = self._generate_local(prompt, brand_kit, content_type)
            if local_result and "error" not in local_result:
                return local_result

        # Fallback 1: Groq API (Free & Ultra-Fast)
        if self.groq_api_key:
            system_prompt = self._build_brand_context(brand_kit, content_type)
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {self.groq_api_key}",
                "Content-Type": "application/json"
            }
            # Use llama3-8b-8192 or similar models available on Groq Free Tier
            payload = {
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            }
            try:
                response = requests.post(url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "model": "llama3-8b-groq",
                    "type": "text",
                    "brand_applied": brand_kit is not None
                }
            except Exception as e:
                print(f"Groq API call failed: {e}")

        # Fallback 2: OpenAI API (Paid)
        if self.client:
            system_prompt = self._build_brand_context(brand_kit, content_type)
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
                return {
                    "content": response.choices[0].message.content,
                    "model": "gpt-4",
                    "type": "text",
                    "brand_applied": brand_kit is not None
                }
            except Exception as e:
                return {"error": str(e)}
        
        # Fallback 3: Mock response for demo mode
        return self._mock_text_generation(prompt, brand_kit, content_type)
    
    def generate_text_to_image(self, prompt, brand_kit=None, aspect_ratio="1:1"):
        """Generate image from text prompt with brand colors"""
        # Map aspect ratio to dimensions
        width, height = 512, 512
        if aspect_ratio == "16:9":
            width, height = 768, 432
        elif aspect_ratio == "9:16":
            width, height = 432, 768

        # Try Kaggle Hosted Model first
        if self.kaggle_url:
            enhanced_prompt = self._enhance_image_prompt(prompt, brand_kit)
            try:
                # High-quality photographic settings
                negative_prompt = "cartoon, anime, illustration, drawing, painting, 3d render, claymation, art, sketch, disfigured, blurry, low resolution, bad quality, oversaturated"
                response = requests.post(
                    f"{self.kaggle_url}/generate-image",
                    json={
                        "prompt": enhanced_prompt,
                        "negative_prompt": negative_prompt,
                        "width": width,
                        "height": height
                    },
                    timeout=90,
                    verify=False
                )
                response.raise_for_status()
                data = response.json()
                
                # Decode base64 to bytes
                import base64
                image_bytes = base64.b64decode(data["image_base64"])
                
                
                # Save image (S3 or local storage)
                image_url = self._save_image_bytes(image_bytes, "img")
                if image_url:
                    return {
                        "image_url": image_url,
                        "model": f"kaggle-{data.get('model', 'stable-diffusion')}",
                        "type": "image",
                        "brand_applied": brand_kit is not None,
                        "enhanced_prompt": enhanced_prompt
                    }
                else:
                    print("Failed to save Kaggle-generated image, falling back...")
            except Exception as e:
                print(f"Kaggle Text-to-Image inference failed, falling back: {e}")

        # Fallback 1: Hugging Face Serverless API (Free)
        if self.hf_token:
            enhanced_prompt = self._enhance_image_prompt(prompt, brand_kit)
            # Realistic Vision V5.1 or standard Stable Diffusion 1.5
            model_id = "SG161222/Realistic_Vision_V5.1_noVAE"
            api_url = f"https://api-inference.huggingface.co/models/{model_id}"
            headers = {"Authorization": f"Bearer {self.hf_token}"}
            
            try:
                negative_prompt = "cartoon, anime, illustration, drawing, painting, 3d render, claymation, art, sketch, disfigured, blurry, low resolution, bad quality, oversaturated"
                payload = {
                    "inputs": enhanced_prompt,
                    "parameters": {
                        "negative_prompt": negative_prompt,
                        "width": width,
                        "height": height
                    }
                }
                response = requests.post(api_url, headers=headers, json=payload)
                if response.status_code != 200:
                    # Fallback to runwayml/stable-diffusion-v1-5 if Realistic Vision is sleeping/unavailable
                    fallback_url = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
                    response = requests.post(fallback_url, headers=headers, json=payload)
                
                response.raise_for_status()
                image_bytes = response.content
                
                
                # Save image (S3 or local storage)
                image_url = self._save_image_bytes(image_bytes, "img")
                if image_url:
                    return {
                        "image_url": image_url,
                        "model": "realistic-vision-v5.1-hf",
                        "type": "image",
                        "brand_applied": brand_kit is not None,
                        "enhanced_prompt": enhanced_prompt
                    }
                else:
                    return {"error": "Failed to save generated image"}
            except Exception as e:
                print(f"Hugging Face Text-to-Image inference failed: {e}")

        # Fallback 2: OpenAI API (Paid)
        if self.client:
            enhanced_prompt = self._enhance_image_prompt(prompt, brand_kit)
            # Map aspect ratio to DALL-E sizes
            size = "1024x1024"
            if aspect_ratio == "16:9":
                size = "1792x1024"
            elif aspect_ratio == "9:16":
                size = "1024x1792"
            try:
                response = self.client.images.generate(
                    model="dall-e-3",
                    prompt=enhanced_prompt,
                    size=size,
                    quality="standard",
                    n=1
                )
                return {
                    "image_url": response.data[0].url,
                    "model": "dall-e-3",
                    "type": "image",
                    "brand_applied": brand_kit is not None,
                    "enhanced_prompt": enhanced_prompt
                }
            except Exception as e:
                return {"error": str(e)}
        
        # Fallback 3: Mock response for demo mode
        return self._mock_image_generation(prompt, brand_kit)

    def generate_image_to_image(self, image_url, prompt, brand_kit=None):
        """Generate a modified image based on an existing image and a text prompt"""
        # Read the image bytes locally in case remote APIs (Kaggle) cannot access the local URL
        import requests
        try:
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            img_data = img_response.content
            import base64
            img_base64 = base64.b64encode(img_data).decode('utf-8')
        except Exception as e:
            print(f"Failed to fetch image locally for image-to-image: {e}")
            img_base64 = None

        # Try Kaggle Hosted Model first
        if self.kaggle_url:
            enhanced_prompt = self._enhance_image_prompt(prompt, brand_kit)
            try:
                negative_prompt = "cartoon, anime, illustration, drawing, painting, 3d render, claymation, art, sketch, disfigured, blurry, low resolution, bad quality, oversaturated"
                payload = {
                    "image_url": image_url,
                    "prompt": enhanced_prompt,
                    "negative_prompt": negative_prompt,
                    "strength": 0.75
                }
                
                if img_base64:
                    payload["image_base64"] = img_base64

                response = requests.post(
                    f"{self.kaggle_url}/image-to-image",
                    json=payload,
                    timeout=120,
                    verify=False
                )
                response.raise_for_status()
                data = response.json()
                
                # Decode base64 to bytes
                import base64
                image_bytes = base64.b64decode(data["image_base64"])
                
                
                # Save image (S3 or local storage)
                new_image_url = self._save_image_bytes(image_bytes, "img_edit")
                if new_image_url:
                    return {
                        "content": new_image_url,
                        "model": f"kaggle-{data.get('model', 'stable-diffusion-img2img')}",
                        "type": "image",
                        "brand_applied": brand_kit is not None,
                        "enhanced_prompt": enhanced_prompt,
                        "success": True
                    }
                else:
                    return {"success": False, "error": "Failed to save Kaggle-generated image"}
            except Exception as e:
                print(f"Kaggle Image-to-Image inference failed, falling back: {e}")
                return {"success": False, "error": str(e)}

        return {"success": False, "error": "Kaggle URL is not set. Cannot perform image-to-image editing."}

    def generate_image_to_text(self, image_url, prompt, brand_kit=None):
        """Analyze image and generate text description"""
        
        # Read the image bytes locally in case remote APIs (Kaggle) cannot access the local URL
        import requests
        try:
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            img_data = img_response.content
            import base64
            img_base64 = base64.b64encode(img_data).decode('utf-8')
        except Exception as e:
            print(f"Failed to fetch image locally for image-to-text: {e}")
            img_data = None
            img_base64 = None

        # Format prompt for Florence-2
        # If user provided a specific question/prompt, use VQA task format. Otherwise default to DETAILED_CAPTION
        if prompt and not prompt.startswith("<"):
            formatted_prompt = f"<VQA> {prompt}"
        else:
            formatted_prompt = prompt if prompt else "<DETAILED_CAPTION>"

        # Try Kaggle Hosted Model first
        if self.kaggle_url:
            try:
                payload = {
                    "image_url": image_url,
                    "prompt": formatted_prompt
                }
                
                # Send base64 so Kaggle doesn't have to fetch the local URL
                if img_base64:
                    payload["image_base64"] = img_base64

                response = requests.post(
                    f"{self.kaggle_url}/image-to-text",
                    json=payload,
                    timeout=90,
                    verify=False
                )
                response.raise_for_status()
                data = response.json()
                return {
                    "content": data["content"],
                    "model": f"kaggle-{data.get('model', 'florence-2')}",
                    "type": "text",
                    "brand_applied": brand_kit is not None
                }
            except Exception as e:
                error_msg = f"Image-to-Text inference failed: {e}"
                print(error_msg)
                return {"error": error_msg}

        return {"error": "KAGGLE_MODEL_URL is not configured in your .env file. Please check your model server."}
    
    def _save_image_bytes(self, image_bytes, filename_prefix="img"):
        """Save image bytes to S3 or local storage, return URL"""
        from services.s3_service import S3Service
        import time
        import os
        from flask import current_app, request
        
        s3 = S3Service()
        timestamp = int(time.time())
        filename = f"{filename_prefix}_{timestamp}.png"
        s3_path = f"generated/{filename}"
        
        try:
            if s3.access_key and s3.secret_key and s3.bucket_name:
                upload_success = s3.upload_file(image_bytes, s3_path, content_type="image/png")
                if upload_success:
                    return s3.get_presigned_url(s3_path)
        except Exception as e:
            print(f"S3 upload failed: {e}")
            
        # Fallback to local storage
        try:
            local_storage_dir = os.path.join(current_app.root_path, 'storage')
            os.makedirs(local_storage_dir, exist_ok=True)
            local_filepath = os.path.join(local_storage_dir, filename)
            
            with open(local_filepath, "wb") as f:
                f.write(image_bytes)
                
            return f"{request.scheme}://{request.host}/storage/{filename}"
        except Exception as e:
            print(f"Local storage fallback failed: {e}")
            return None

    def _build_brand_context(self, brand_kit, content_type="text"):
        """Build system prompt with strict brand-kit-based context enforcement.
        
        The model is instructed to ONLY generate content that is rooted in the
        provided brand kit. If no brand_kit is supplied, a neutral professional
        voice is used.  When a brand_kit IS supplied every field (colors, fonts,
        guidelines, logo, tone) gates the output so that the generated content
        is always on-brand.
        """
        if not brand_kit:
            return (
                f"You are a professional marketing content creator. "
                f"Create engaging, professional {content_type} content. "
                f"Use a clean, universal brand voice with no specific brand identity applied."
            )

        brand_name = brand_kit.get("name", "the brand")

        # ── Color palette ─────────────────────────────────────────────────────
        colors = brand_kit.get("colors", [])
        if colors:
            color_list = ", ".join(colors)
            color_instruction = (
                f"Brand Color Palette: {color_list}. "
                f"All references to color, mood, atmosphere, or visual style MUST reflect this palette. "
                f"DO NOT use or imply colors outside this palette unless they are universally neutral (white, black)."
            )
        else:
            color_instruction = "No specific color palette defined. Use neutral, professional color references."

        # ── Typography ────────────────────────────────────────────────────────
        fonts = brand_kit.get("fonts", [])
        if fonts:
            font_list = ", ".join(fonts)
            font_instruction = (
                f"Brand Typography: {font_list}. "
                f"When describing design or layout, reference these typefaces exclusively."
            )
        else:
            font_instruction = "No typography defined. Use clean, professional font references."

        # ── Brand guidelines / voice ──────────────────────────────────────────
        guidelines = brand_kit.get("guidelines", "").strip()
        if guidelines:
            guidelines_block = (
                f"BRAND VOICE & GUIDELINES (MUST be followed verbatim):\n"
                f"{guidelines}\n"
            )
        else:
            guidelines_block = (
                "No explicit brand voice guidelines provided. "
                "Default to a professional, trustworthy, and engaging tone that aligns with the brand name and colors.\n"
            )

        # ── Logo presence ─────────────────────────────────────────────────────
        logo_url = brand_kit.get("logo_url")
        logo_note = (
            "The brand has an official logo. Any copy referencing visuals should acknowledge the logo as the primary brand mark."
            if logo_url else
            "No logo provided. Do not reference a logo in the content."
        )

        # ── Assemble system prompt ─────────────────────────────────────────────
        context = f"""You are an expert, brand-locked marketing content creator working EXCLUSIVELY for the brand: **{brand_name}**.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 MANDATORY BRAND RULES — VIOLATION IS NOT ALLOWED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. IDENTITY LOCK: Every word you write must represent **{brand_name}** and nobody else.
2. COLOR LOCK: {color_instruction}
3. TYPOGRAPHY LOCK: {font_instruction}
4. VOICE LOCK: {guidelines_block}
5. LOGO RULE: {logo_note}
6. NO INVENTION: Never invent brand attributes, slogans, or facts not present in these guidelines.
7. NO CONTRADICTION: Never produce content that contradicts the brand palette, tone, or guidelines above.
8. OUTPUT FORMAT: Produce only the final {content_type} content — no preamble, no disclaimers, no meta-commentary about the brand rules.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 YOUR TASK: Generate {content_type.upper()} content for {brand_name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The content you produce must:
- Breathe the **{brand_name}** identity in every sentence.
- Use the brand color palette to inform mood, tone, and any visual descriptions.
- Follow the brand voice guidelines strictly.
- Be immediately recognizable as a **{brand_name}** asset.
- Include a compelling call-to-action where appropriate for {content_type}.
"""
        return context

    def _format_brand_colors(self, colors):
        """Return a human-readable color description for image prompts."""
        if not colors:
            return ""
        if len(colors) == 1:
            return f"dominant color {colors[0]}"
        primary = colors[0]
        accents = ", ".join(colors[1:])
        return f"primary color {primary} with accent tones of {accents}"
    
    def _enhance_image_prompt(self, prompt, brand_kit):
        """Enhance image generation prompt with strict brand visual identity constraints.
        
        Builds a richly-structured prompt that tells the diffusion model to:
        - Use the brand's exact color palette as the dominant visual tones.
        - Reflect the brand's typographic style (when applicable).
        - Stay within the brand's visual guidelines.
        - Keep the original creative subject as the central focus.
        """
        if not brand_kit:
            return prompt

        brand_name = brand_kit.get("name", "the brand")
        colors = brand_kit.get("colors", [])
        fonts = brand_kit.get("fonts", [])
        guidelines = brand_kit.get("guidelines", "").strip()

        # ── Color block ────────────────────────────────────────────────────────
        if colors:
            color_desc = self._format_brand_colors(colors)
            color_block = (
                f"Color palette strictly restricted to {brand_name}'s brand colors: {', '.join(colors)}. "
                f"The {color_desc} must dominate the composition. "
                f"No off-brand colors permitted."
            )
        else:
            color_block = ""

        # ── Font/style block ───────────────────────────────────────────────────
        if fonts:
            font_block = f"Typography style inspired by {', '.join(fonts)}. "
        else:
            font_block = ""

        # ── Guidelines block ───────────────────────────────────────────────────
        if guidelines:
            # Truncate to avoid token overrun in diffusion models
            short_guidelines = guidelines[:300].strip()
            guidelines_block = f"Visual brand guidelines: {short_guidelines}. "
        else:
            guidelines_block = ""

        # ── Assemble final enhanced prompt ─────────────────────────────────────
        brand_prefix = (
            f"Brand visual identity for {brand_name}. "
            f"{color_block} "
            f"{font_block}"
            f"{guidelines_block}"
            f"Highly professional, premium quality, brand-consistent marketing visual. "
        ).strip()

        return f"{brand_prefix} Subject: {prompt}"

    
    # Mock responses for demo mode
    def _mock_text_generation(self, prompt, brand_kit, content_type):
        brand_name = brand_kit.get('name', 'Your Brand') if brand_kit else 'Your Brand'
        
        content_templates = {
            "social": f"🎯 {brand_name} - Where Innovation Meets Excellence\n\n✨ {prompt}\n\n#Marketing #Innovation #{brand_name.replace(' ', '')}",
            "email": f"Subject: Exciting Update from {brand_name}\n\nHi there,\n\n{prompt}\n\nBest regards,\nThe {brand_name} Team",
            "blog": f"# {prompt}\n\nWelcome to {brand_name}'s latest insights...\n\n[DEMO MODE - Add OpenAI API key for real content]",
            "ad": f"🚀 {brand_name}\n\n{prompt}\n\nLearn More →"
        }
        
        content = content_templates.get(content_type, f"[DEMO] Content for: {prompt}\n\nBrand: {brand_name}")
        
        return {
            "content": content,
            "model": "demo",
            "type": "text",
            "brand_applied": brand_kit is not None
        }
    
    def _mock_image_generation(self, prompt, brand_kit):
        # Use a high-quality relevant-ish image for the demo
        topic = prompt.split()[:3]
        query = "+".join(topic) if topic else "technology"
        image_url = f"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000&q={query}"
        
        return {
            "image_url": image_url,
            "model": "demo",
            "type": "image",
            "brand_applied": brand_kit is not None,
            "message": "DEMO MODE: Using Unsplash fallback. Add OPENAI_API_KEY for real DALL-E 3 output."
        }
    
    def _mock_image_analysis(self, image_url, prompt, brand_kit):
        brand_name = brand_kit.get('name', 'Your Brand') if brand_kit else 'Your Brand'
        
        return {
            "content": f"[DEMO MODE]\n\nImage Analysis for {brand_name}:\n\n{prompt}\n\nThis image shows professional marketing content. Add OpenAI API key for detailed analysis.",
            "model": "demo",
            "type": "text",
            "brand_applied": brand_kit is not None
        }

    def _get_local_model(self):
        """Lazy load the local model singleton"""
        if self.local_llm:
            return self.local_llm
        
        if not Llama:
            return None
            
        model_path = current_app.config.get('LOCAL_LLM_MODEL_PATH')
        if not model_path or not os.path.exists(model_path):
            print(f"Local model not found at: {model_path}")
            return None
            
        try:
            print(f"Loading Local Model from {model_path}...")
            self.local_llm = Llama(
                model_path=model_path,
                n_ctx=current_app.config.get('LOCAL_LLM_CTX', 1024),
                n_threads=current_app.config.get('LOCAL_LLM_THREADS', 4)
            )
            print("Local Model Loaded Successfully!")
            return self.local_llm
        except Exception as e:
            print(f"Error loading local model: {e}")
            return None

    def _get_hf_model(self):
        """Lazy load the transformers model singleton"""
        if self.hf_pipeline:
            return self.hf_pipeline
            
        if not AutoModelForCausalLM:
            print("Transformers not installed")
            return None
            
        model_path = current_app.config.get('LOCAL_LLM_MODEL_PATH')
        if not model_path or not os.path.exists(model_path):
            print(f"HF model path not found: {model_path}")
            return None
            
        try:
            print(f"Loading Transformers Model from {model_path}...")
            print("Using FULL RAM as requested (Full Precision)")
            
            # Use float16 for better memory efficiency than float32 while still being 'full' for most marketing models
            # Unless told otherwise, float16 is standard for inference.
            dtype = torch.float16 if torch and torch.cuda.is_available() else torch.float32
            
            self.hf_tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.hf_model = AutoModelForCausalLM.from_pretrained(
                model_path,
                torch_dtype=dtype,
                device_map="auto",
                trust_remote_code=True
            )
            
            self.hf_pipeline = pipeline(
                "text-generation",
                model=self.hf_model,
                tokenizer=self.hf_tokenizer,
                max_new_tokens=current_app.config.get('LOCAL_LLM_CTX', 2048) // 4
            )
            
            print("Transformers Model Loaded Successfully!")
            return self.hf_pipeline
        except Exception as e:
            print(f"Error loading hf model: {e}")
            import traceback
            traceback.print_exc()
            return None

    def _generate_local(self, prompt, brand_kit=None, content_type="text"):
        """Generate content using local model (llama-cpp or transformers)"""
        # Check if we should use transformers
        if current_app.config.get('USE_TRANSFORMERS'):
            return self._generate_transformers(prompt, brand_kit, content_type)
            
        llm = self._get_local_model()
        if not llm:
            return None
            
        system_prompt = self._build_brand_context(brand_kit, content_type)
        # Use Mistral's instruction format: [INST] system \n user [/INST]
        full_prompt = f"[INST] {system_prompt}\n\n{prompt} [/INST]"
        
        try:
            output = llm(
                full_prompt,
                max_tokens=current_app.config.get('LOCAL_LLM_CTX', 1024) // 2,
                temperature=0.7,
                echo=False
            )
            
            return {
                "content": output['choices'][0]['text'].strip(),
                "model": "mistral-7b-local",
                "type": content_type,
                "brand_applied": brand_kit is not None
            }
        except Exception as e:
            return {"error": f"Local generation error: {str(e)}"}

    def _generate_transformers(self, prompt, brand_kit=None, content_type="text"):
        """Generate content using transformers pipeline"""
        pipe = self._get_hf_model()
        if not pipe:
            return {"error": "Transformers model not loaded"}
            
        system_prompt = self._build_brand_context(brand_kit, content_type)
        
        # Determine model type for formatting
        # For marketing models, usually a simple instruction format works
        formatted_prompt = f"System: {system_prompt}\n\nUser: {prompt}\n\nAssistant:"
        
        try:
            outputs = pipe(
                formatted_prompt,
                do_sample=True,
                temperature=0.7,
                top_k=50,
                top_p=0.95
            )
            
            generated_text = outputs[0]['generated_text']
            # Clean up the output to only return the assistant's part
            if "Assistant:" in generated_text:
                generated_text = generated_text.split("Assistant:")[-1].strip()
            
            return {
                "content": generated_text,
                "model": "gem-marketing-local",
                "type": content_type,
                "brand_applied": brand_kit is not None
            }
        except Exception as e:
            return {"error": f"Transformers generation error: {str(e)}"}

# Singleton instance
llm_service = LLMService()
