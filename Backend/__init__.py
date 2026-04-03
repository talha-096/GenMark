from flask import Flask
from .config import config
from .core.extensions import db, jwt, cors, limiter, scheduler, swagger

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)
    scheduler.init_app(app)
    swagger.init_app(app)
    
    # Start Scheduler
    if not scheduler.running and app.config.get('SCHEDULER_API_ENABLED'):
        from .jobs.cleanup import cleanup_old_content
        scheduler.add_job(id='cleanup_job', func=cleanup_old_content, trigger='interval', days=1)
        scheduler.start()

    # Register Blueprints from api directory
    from .api.auth import auth_bp
    from .api.content_routes import content_bp
    from .api.brand_routes import brand_bp
    from .api.project_routes import project_bp
    from .api.generation_routes import generation_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(content_bp, url_prefix='/api/content')
    app.register_blueprint(brand_bp, url_prefix='/api/brand')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(generation_bp, url_prefix='/api/generate')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'db': 'connected', 'version': '1.0.0'}

    return app
