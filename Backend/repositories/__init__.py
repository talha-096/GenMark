# repositories/__init__.py
# This package is the Data Access Layer — all MongoDB queries live here.
# Routes and services NEVER query MongoDB directly; they always call a repo.
#
# Repositories:
#   user_repo.py        →  CRUD for the users collection
#   content_repo.py     →  CRUD for the marketing_content collection
#   generation_repo.py  →  CRUD for generation history records
#   model_repo.py       →  CRUD for AI model metadata
#   usage_repo.py       →  CRUD for usage / billing tracking records
