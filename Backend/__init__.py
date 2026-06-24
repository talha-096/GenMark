from flask import Flask
from config import config
from core.extensions import db, jwt, cors, limiter, scheduler, swagger

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS to be very permissive for local development
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        },
        r"/storage/*": {
            "origins": "*",
            "methods": ["GET", "OPTIONS"]
        }
    })
    
    limiter.init_app(app)
    swagger.init_app(app)
    
    if not app.config.get('TESTING'):
        scheduler.init_app(app)
        # Start Scheduler
        if not scheduler.running and app.config.get('SCHEDULER_API_ENABLED'):
            from jobs.cleanup import cleanup_old_content
            scheduler.add_job(id='cleanup_job', func=cleanup_old_content, trigger='interval', days=1)
            scheduler.start()

    # Register Blueprints from api directory
    from api.auth import auth_bp
    from api.content_routes import content_bp
    from api.brand_routes import brand_bp
    from api.project_routes import project_bp
    from api.generation_routes import generation_bp
    from api.dashboard_routes import dashboard_bp
    from api.settings_routes import settings_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(content_bp, url_prefix='/api/content')
    app.register_blueprint(brand_bp, url_prefix='/api/brand')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(generation_bp, url_prefix='/api/generate')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')

    # Serve static files from storage folder as local fallback
    import os
    from flask import send_from_directory
    storage_dir = os.path.join(app.root_path, 'storage')
    os.makedirs(storage_dir, exist_ok=True)
    
    @app.route('/storage/<path:filename>')
    def serve_storage(filename):
        return send_from_directory(storage_dir, filename)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"message": "Signature verification failed", "error": f"Invalid token: {error}"}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"message": "Request does not contain an access token", "error": error}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"message": "The token has expired", "error": "token_expired"}, 401

    @app.route('/api/health')
    def health_check():
        import requests as req_lib

        # ── Database check ─────────────────────────────────────────────
        try:
            db.cx.admin.command('ping')
            db_status = 'connected'
        except Exception as e:
            db_status = f'disconnected: {str(e)}'

        # ── Kaggle Model Server check ──────────────────────────────────
        kaggle_url = app.config.get('KAGGLE_MODEL_URL')
        if kaggle_url:
            try:
                resp = req_lib.get(
                    f"{kaggle_url}/health",
                    timeout=10,
                    verify=False,
                    headers={"ngrok-skip-browser-warning": "1"}
                )
                resp.raise_for_status()
                kaggle_data = resp.json()
                kaggle_status = 'connected'
                kaggle_models = kaggle_data.get('models', [])
            except Exception as e:
                kaggle_status = f'unreachable: {str(e)}'
                kaggle_models = []
        else:
            kaggle_status = 'not_configured'
            kaggle_models = []

        all_healthy = (db_status == 'connected' and kaggle_status == 'connected')

        return {
            'status': 'healthy' if all_healthy else 'degraded',
            'db': db_status,
            'kaggle_model_server': kaggle_status,
            'kaggle_models': kaggle_models,
            'version': '1.1.0'
        }

    @app.errorhandler(Exception)
    def handle_exception(e):
        # Log the error to console
        print(f"Server Error: {str(e)}")
        # Return as JSON so frontend can display it
        return {"message": f"Server Error: {str(e)}"}, 500

    return app
