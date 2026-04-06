from flask import request
from flask_restx import Resource, Namespace
from flask_jwt_extended import create_access_token
from app.models.user import User # Ton modèle User SQL

api = Namespace('auth', description='Authentication operations')

@api.route('/login')
class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # 1. Chercher l'utilisateur en base
        user = User.query.filter_by(email=email).first()

        # 2. Vérifier le mot de passe (avec bcrypt)
        if user and user.verify_password(password):
            # 3. Créer le token
            access_token = create_access_token(identity=user.id)
            return {
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "name": f"{user.first_name} {user.last_name}",
                    "email": user.email,
                    "role": "Admin" if user.is_admin else "Member"
                }
            }, 200
        
        return {"message": "Invalid credentials"}, 401