# pipelines/__init__.py
# This package contains multi-step AI workflow orchestration.
# Pipelines chain ai_models together to produce a final marketing output.
#
# Pipelines:
#   marketing_text_pipeline.py    →  Image → Caption → Marketing Copy (full chain)
#   ad_image_pipeline.py          →  Text prompt → Ad image
#   product_analysis_pipeline.py  →  Product image → Analysis + Copy
