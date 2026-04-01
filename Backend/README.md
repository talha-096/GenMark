# Backend

Python FastAPI backend for GenMark.

## Structure

```
Backend/
├── main.py              # FastAPI app + router registration
├── config.py            # Environment / settings
├── database.py          # DB connection
├── requirements.txt
│
├── api/                 # Route handlers
│   ├── auth.py
│   ├── auth_routes.py
│   ├── brand_routes.py
│   ├── content_routes.py
│   ├── dashboard_routes.py
│   └── generation_routes.py
│
├── models/              # SQLAlchemy / Pydantic models
│   ├── brand_kit.py
│   ├── content.py
│   ├── marketing_content.py
│   └── user.py
│
└── services/            # Business logic
    └── llm_service.py
```

## Run

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
