from flask import Flask
from .config import config
from .extensions import db, jwt, cors, limiter, scheduler, swagger

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
    if not scheduler.running and app.config['SCHEDULER_API_ENABLED']:
        from .jobs.cleanup import cleanup_old_content
        scheduler.add_job(id='cleanup_job', func=cleanup_old_content, trigger='interval', days=1)
        scheduler.start()

    # Register Blueprints
    # from .api.auth import auth_bp
    import sys
    import os
    # Add Backend directory to path to import routes module
    sys.path.insert(0, os.path.dirname(__file__) + '/..')
    from routes.posts import posts_bp
    from routes.auth import auth_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'db': 'connected'}

    return app
