# services/__init__.py
# This package contains the business logic layer.
# Services sit between API routes and repositories/AI models.
#
# Services:
#   llm_service.py   →  Orchestrates all AI model calls (text↔image↔text)
#   s3_service.py    →  AWS S3 / local file storage for generated images
