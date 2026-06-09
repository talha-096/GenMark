# security/__init__.py
# This package contains all authentication and security utilities.
# Used by API routes (via decorators) and services.
#
# Files:
#   jwt_handler.py   →  JWT token creation, decoding, and validation
#   hashing.py       →  Password hashing and verification (bcrypt)
#   middleware.py    →  @require_auth decorator for protecting routes
#   rate_limiter.py  →  Per-route request rate limiting logic
#   roles.py         →  Role constants and role-checking helpers (admin, user, enterprise)
