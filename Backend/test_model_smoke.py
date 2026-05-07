import os
import sys

# Add the current directory to path so we can import app and services
sys.path.append(os.path.abspath(os.curdir))

from flask import Flask
from services.llm_service import LLMService

app = Flask(__name__)
# Mock config
app.config['LOCAL_LLM_MODEL_PATH'] = r'D:\GenMark\Model'
app.config['LOCAL_LLM_THREADS'] = 4
app.config['LOCAL_LLM_CTX'] = 2048
app.config['USE_TRANSFORMERS'] = True
app.config['QUANTIZE_MODEL'] = False

with app.app_context():
    print("Initializing LLMService...")
    service = LLMService()
    
    print("\nAttempting to load model (this may take a few minutes and use ~10GB RAM)...")
    prompt = "Create a catchy social media ad for a new AI coding assistant named GenMark."
    
    result = service.generate_text_to_text(prompt, content_type="social")
    
    if "error" in result:
        print(f"\n[ERROR]: {result['error']}")
    else:
        print("\n[SUCCESS]!")
        print(f"Model: {result['model']}")
        print(f"Content:\n{result['content']}")
