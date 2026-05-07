import os
from __init__ import create_app

# The Application Factory is defined in __init__.py
# run.py is the entry point for the application

app = create_app(os.getenv('FLASK_CONFIG', 'default'))

if __name__ == '__main__':
    # Using 'stat' reloader instead of 'watchdog' on Windows to avoid excessive 
    # monitoring of site-packages and improve stability. 
    # Note: If you see WinError 10038, it's a known Werkzeug issue on Windows.
    # It usually doesn't affect the running app, only the restart process.
    try:
        app.run(
            host='0.0.0.0', 
            port=5000, 
            debug=True, 
            threaded=True,
            use_reloader=True,
            reloader_type='stat'
        )
    except Exception as e:
        print(f"Server Startup Error: {e}")


