import os
from __init__ import create_app

# The Application Factory is defined in __init__.py
# run.py is the entry point for the application
# Use a production server to run this app or 'flask run' for development

app = create_app(os.getenv('FLASK_CONFIG', 'default'))

