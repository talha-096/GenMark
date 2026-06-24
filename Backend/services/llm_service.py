import os
import requests
import time
import base64
import io
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from flask import current_app

class LLMService:
    def __init__(self):
        # Kaggle Model Server (sole AI provider)
        self.kaggle_url = os.getenv("KAGGLE_MODEL_URL")
        if self.kaggle_url:
            print(f"[OK] Kaggle Model URL configured: {self.kaggle_url}")
        else:
            print("[WARN] KAGGLE_MODEL_URL not set — AI features will not work!")
    
    def generate_text_to_text(self, prompt, brand_kit=None, content_type="text"):
        """Generate text content from text prompt via Kaggle notebook"""
        if not self.kaggle_url:
            return {"error": "KAGGLE_MODEL_URL is not configured. Start the Kaggle notebook and set the URL in .env"}

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
            content = self._extract_generation(content, prompt, system_prompt)
            content = self._clean_stop_words(content)
            return {
                "content": content,
                "model": f"kaggle-{data.get('model', 'gemini')}",
                "type": "text",
                "brand_applied": brand_kit is not None
            }
        except Exception as e:
            print(f"Kaggle text generation failed: {e}")
            return {"error": f"Kaggle text generation failed: {str(e)}"}
    
    def generate_text_to_image(self, prompt, brand_kit=None, aspect_ratio="1:1"):
        """Generate image from text prompt via Kaggle notebook"""
        if not self.kaggle_url:
            return {"error": "KAGGLE_MODEL_URL is not configured. Start the Kaggle notebook and set the URL in .env"}

        # Map aspect ratio to dimensions
        width, height = 512, 512
        if aspect_ratio == "16:9":
            width, height = 768, 432
        elif aspect_ratio == "9:16":
            width, height = 432, 768

        enhanced_prompt = self._enhance_image_prompt(prompt, brand_kit)
        try:
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
                return {"error": "Failed to save generated image"}
        except Exception as e:
            print(f"Kaggle Text-to-Image inference failed: {e}")
            return {"error": f"Kaggle image generation failed: {str(e)}"}

    def generate_image_to_image(self, image_url, prompt, brand_kit=None):
        """Generate a modified image based on an existing image and a text prompt via Kaggle notebook"""
        if not self.kaggle_url:
            return {"success": False, "error": "KAGGLE_MODEL_URL is not configured. Start the Kaggle notebook and set the URL in .env"}

        # Read the image bytes locally so Kaggle doesn't have to fetch the local URL
        try:
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            img_data = img_response.content
            img_base64 = base64.b64encode(img_data).decode('utf-8')
        except Exception as e:
            print(f"Failed to fetch image locally for image-to-image: {e}")
            img_data = None
            img_base64 = None

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
            print(f"Kaggle Image-to-Image inference failed: {e}")
            return {"success": False, "error": f"Kaggle image-to-image failed: {str(e)}"}

    def generate_image_to_text(self, image_url, prompt, brand_kit=None):
        """Analyze image and generate text description via Kaggle notebook"""
        if not self.kaggle_url:
            return {"error": "KAGGLE_MODEL_URL is not configured. Start the Kaggle notebook and set the URL in .env"}

        # Read the image bytes locally so Kaggle doesn't have to fetch the local URL
        try:
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            img_data = img_response.content
            img_base64 = base64.b64encode(img_data).decode('utf-8')
        except Exception as e:
            print(f"Failed to fetch image locally for image-to-text: {e}")
            img_data = None
            img_base64 = None

        # Format prompt for Florence-2
        if prompt and not prompt.startswith("<"):
            formatted_prompt = f"<VQA> {prompt}"
        else:
            formatted_prompt = prompt if prompt else "<DETAILED_CAPTION>"

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
            print(f"Kaggle Image-to-Text inference failed: {e}")
            return {"error": f"Kaggle image-to-text failed: {str(e)}"}
    
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
        """Enhance image generation prompt with strict brand visual identity constraints."""
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

    def _extract_generation(self, content, prompt=None, system_prompt=None):
        """Extract only the model's generated response from the full text output,
        stripping the system/user prompts and any instruction/chat delimiters.
        """
        delimiters = [
            "[/INST]",
            "<start_of_turn>model\n",
            "<start_of_turn>model",
            "<start_of_turn> model\n",
            "<start_of_turn> model",
            "<|start_header_id|>assistant<|end_header_id|>\n\n",
            "<|start_header_id|>assistant<|end_header_id|>",
            "Assistant:",
            "Response:"
        ]
        
        for delimiter in delimiters:
            if delimiter in content:
                content = content.split(delimiter)[-1].strip()
                return content
        
        if prompt and prompt in content:
            content = content.replace(prompt, "").strip()
        if system_prompt and system_prompt in content:
            content = content.replace(system_prompt, "").strip()
            
        return content

    def _clean_stop_words(self, content):
        """Clean any trailing or leading stop tokens or tags from the content."""
        for stop_word in ["<end_of_turn>", "<start_of_turn>", "</start_of_turn>", "<bos>", "<eos>", "<|eot_id|>", "<|im_end|>", "model\n", "assistant\n"]:
            if stop_word in content:
                content = content.split(stop_word)[0].strip()
        return content

# Singleton instance
llm_service = LLMService()
