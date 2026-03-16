from flask_restx import Namespace, Resource
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity

api = Namespace('', description='Protected endpoints')

@api.route('/protected')
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        """A protected endpoint that requires a valid JWT token"""
        print("jwt------")
        print(get_jwt_identity())
        current_user = get_jwt_identity()
        print("claims------")
        print(get_jwt())
        claims = get_jwt()["is_admin"]
        if claims:
            return {'message': f'Hello, admin {current_user}'}, 200
        else:
            return {'message': f'Hello, user {current_user}'}, 200
