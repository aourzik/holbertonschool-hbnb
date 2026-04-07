from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # 1. Configuration CORS standard
    CORS(app, resources={r"/api/v1/*": {"origins": "*"}}, supports_credentials=True)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///development.db'
    app.config['JWT_SECRET_KEY'] = 'ton_secret_tres_secret'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # 3. Initialisation de l'API RestX
    from flask_restx import Api
    api = Api(app, title='HBnB API', version='1.0', prefix='/api/v1', doc='/api/v1/')

    from app.api.v1.auth import api as auth_ns
    from app.api.v1.places import api as places_ns
    
    api.add_namespace(auth_ns, path='/auth')
    api.add_namespace(places_ns, path='/places')

    return app