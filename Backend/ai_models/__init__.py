# ai_models/__init__.py
# This package contains loader wrappers for the three local AI models.
# Each file loads the model weights from the Model/ directory and
# exposes a simple predict() interface used by services/llm_service.py.
#
# Wrappers:
#   text_llm.py        →  Text-to-Text  (Mistral-7B / Gem-Marketing)
#   text_to_image.py   →  Text-to-Image (Realistic Vision v5.1 / Stable Diffusion)
#   image_to_text.py   →  Image-to-Text (Florence-2-Large)
