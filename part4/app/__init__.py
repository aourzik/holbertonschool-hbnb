from flask import Flask
from flask_restx import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig
from flask_cors import CORS

bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)

    # 1. CORS
    CORS(app, resources={r"/api/v1/*": {"origins": "*"}}, supports_credentials=True)

    app.config.from_object(config_class)
    bcrypt.init_app(app)
    app.config["JWT_SECRET_KEY"] = app.config.get("JWT_SECRET_KEY")
    jwt.init_app(app)
    db.init_app(app)

    # 2. Namespaces
    from app.api.v1.users import api as users_ns
    from app.api.v1.amenities import api as amenities_ns
    from app.api.v1.places import api as places_ns
    from app.api.v1.reviews import api as reviews_ns
    from app.api.v1.auth import api as auth_ns
    from app.api.v1.protected import api as protected_ns
    from app.api.v1.bookings import api as bookings_ns

    api = Api(
        app,
        version='1.0',
        title='HBnB API',
        description='HBnB Application API',
        doc='/'
    )

    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    api.add_namespace(places_ns, path='/api/v1/places')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    api.add_namespace(auth_ns, path='/api/v1/auth')
    api.add_namespace(protected_ns, path='/api/v1/protected')
    api.add_namespace(bookings_ns, path='/api/v1/bookings')

    # 3. Auto-Seed Logic
    with app.app_context():
        db.create_all()
        
        # On vérifie si la base est vide (on regarde s'il y a des utilisateurs)
        from app.models.user import User
        if not User.query.first():
            print("--- La base est vide. Lancement du Seed Royal ---")
            try:
                # On importe la fonction seed_all de ton fichier seed_all.py
                from seed_all import seed_all
                # On appelle la fonction (elle utilisera l'app_context actuel)
                seed_all()
            except ImportError:
                print("--- Erreur : Le fichier seed_all.py est introuvable ---")
            except Exception as e:
                print(f"--- Erreur lors du seed automatique : {e} ---")
        else:
            print("--- Données détectées. Le Ton est déjà prêt. ---")

    return app