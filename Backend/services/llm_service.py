import os
from openai import OpenAI

class LLMService:
    def __init__(self):
        # Support for multiple AI providers
        self.openai_key = os.getenv("OPENAI_API_KEY", "your-api-key-here")
        self.client = OpenAI(api_key=self.openai_key) if self.openai_key != "your-api-key-here" else None
    
    def generate_text_to_text(self, prompt, brand_kit=None, content_type="text"):
        """Generate text content from text prompt"""
        if not self.client:
            return self._mock_text_generation(prompt, brand_kit, content_type)
        
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
    
    def generate_text_to_image(self, prompt, brand_kit=None):
        """Generate image from text prompt with brand colors"""
        if not self.client:
            return self._mock_image_generation(prompt, brand_kit)
        
        # Enhance prompt with brand colors
        enhanced_prompt = self._enhance_image_prompt(prompt, brand_kit)
        
        try:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=enhanced_prompt,
                size="1024x1024",
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
    
    def generate_image_to_text(self, image_url, prompt, brand_kit=None):
        """Analyze image and generate text description"""
        if not self.client:
            return self._mock_image_analysis(image_url, prompt, brand_kit)
        
        system_prompt = self._build_brand_context(brand_kit, "image_analysis")
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": image_url}}
                        ]
                    }
                ],
                max_tokens=500
            )
            
            return {
                "content": response.choices[0].message.content,
                "model": "gpt-4-vision",
                "type": "text",
                "brand_applied": brand_kit is not None
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _build_brand_context(self, brand_kit, content_type="text"):
        """Build system prompt with brand guidelines"""
        if not brand_kit:
            return f"You are a professional marketing content creator. Create engaging, professional {content_type} content."
        
        context = f"""You are a professional marketing content creator for: {brand_kit.get('name', 'the brand')}.

BRAND IDENTITY:
"""
        
        if brand_kit.get('colors'):
            colors_text = ", ".join(brand_kit['colors'])
            context += f"- Brand Colors: {colors_text}\n"
        
        if brand_kit.get('fonts'):
            fonts_text = ", ".join(brand_kit['fonts'])
            context += f"- Typography: {fonts_text}\n"
        
        if brand_kit.get('guidelines'):
            context += f"\nBRAND GUIDELINES:\n{brand_kit['guidelines']}\n"
        
        context += f"""
TASK: Create {content_type} content that:
- Aligns with the brand identity above
- Uses the brand's voice and tone
- References brand colors when relevant
- Maintains professional quality
- Stays true to brand guidelines
"""
        
        return context
    
    def _enhance_image_prompt(self, prompt, brand_kit):
        """Enhance image generation prompt with brand colors"""
        if not brand_kit or not brand_kit.get('colors'):
            return prompt
        
        colors = brand_kit.get('colors', [])
        color_instruction = f"Use a color palette of {', '.join(colors[:3])}. "
        
        return f"{color_instruction}{prompt}"
    
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

# Singleton instance
llm_service = LLMService()
