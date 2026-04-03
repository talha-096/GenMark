import os
from __init__ import create_app

# The Application Factory is defined in __init__.py
# run.py serves as the entry point for the application

app = create_app(os.getenv('FLASK_CONFIG', 'default'))

if __name__ == "__main__":
    # Ensure accessibility from outside the container
    host = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    app.run(host=host, port=port, debug=debug)
