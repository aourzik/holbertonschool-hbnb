from flask_restx import Namespace, Resource, fields
from app.services import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('users', description='User operations')

# Define the user model for input validation and documentation
user_model = api.model('User', {
    'first_name': fields.String(required=True, description='First name of the user'),
    'last_name': fields.String(required=True, description='Last name of the user'),
    'email': fields.String(required=True, description='Email of the user'),
    'password': fields.String(required=True, description='Password of the user')
})

@api.route('/')
class UserList(Resource):
    @api.expect(user_model)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Invalid input data or email already registered')
    def post(self):
        """Register a new user"""
        try:
            user = facade.create_user(api.payload)
            return {
                "id": user.id,
                "message": "User successfully created"
            }, 201
        except ValueError as e:
            return {"Error": str(e)}, 400
        except TypeError as e:
            return {"Error": str(e)}, 400

    @api.response(200, 'List of users retrieved successfully')
    def get(self):
        """Retrieve a list of all users"""
        all_users = facade.get_all_users()
        users_list = []
        for user in all_users:
            user_dict = user.to_dict()
            user_dict.pop("password", None)
            users_list.append(user_dict)
        return users_list, 200

@api.route('/<user_id>')
class UserResource(Resource):
    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user details by ID"""
        user = facade.get_user(user_id)
        if not user:
            return {"Error": "User not found"}, 404
        user = user.to_dict()
        user.pop("password", None)
        return user, 200

    @jwt_required()
    @api.expect(user_model)
    @api.response(200, 'User updated successfully')
    @api.response(404, 'User not found')
    @api.response(400, 'Invalid input data or email already taken')
    def put(self, user_id):
        """Update entire user details by ID"""
        current_user = get_jwt_identity()
        data = api.payload
        try:
            if str(user_id) != str(current_user):
                return {"Error": 'Unauthorized action'}, 403
            if "email" in data or "password" in data:
                return {"Error": 'You cannot modify email or password'}, 400
            user = facade.update_user(user_id, data).to_dict()
            user.pop("password", None)
            return user, 200
        except ValueError as e:
            if "not found" in str(e).lower():
                return {"Error": str(e)}, 404
            return {"Error": str(e)}, 400
        except TypeError as e:
            return {"Error": str(e)}, 400

@api.route('/email/<email>')
class UserByEmail(Resource):
    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, email):
        """Get user details by email"""
        user = facade.get_user_by_email(email)
        if not user:
            return {"Error": "User not found"}, 404
        user_dict = user.to_dict()
        user_dict.pop("password", None)
        return user_dict, 200
