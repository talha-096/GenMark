from flask import Flask, jsonify
from core.config import Config
from core.extensions import jwt, cors, limiter, swagger
from api.auth import auth_bp
from api.content_routes import content_bp
from api.brand_routes import brand_bp
from api.dashboard_routes import dashboard_bp
from api.generation_routes import generation_bp
from api.project_routes import project_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Set JWT Secret (Should be in .env but fallback provided)
    app.config.setdefault("JWT_SECRET_KEY", "super-secret-key")
    
    # Initialize Extensions
    jwt.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)
    swagger.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(content_bp, url_prefix="/api/content")
    app.register_blueprint(brand_bp, url_prefix="/api/brand")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(generation_bp, url_prefix="/api/generate")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    
    @app.route("/")
    def home():
        return jsonify({
            "message": "GenMark API is running",
            "version": "1.0.0",
            "status": "online"
        })
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(
        debug=app.config.get("DEBUG", True), 
        port=app.config.get("PORT", 5000),
        host="0.0.0.0" # Enable access from outside container
    )
