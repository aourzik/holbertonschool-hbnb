from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity

# ON N'IMPORTE PAS LA FACADE ICI EN HAUT !

api = Namespace('bookings', description='Booking operations')

booking_model = api.model('Booking', {
    'place_id': fields.String(required=True),
    'start_date': fields.String(required=True),
    'end_date': fields.String(required=True)
})

@api.route('/')
class BookingList(Resource):
    @jwt_required()
    def get(self):
        from app.services import facade  # IMPORT LOCAL ICI
        current_user_id = get_jwt_identity()
        bookings = facade.get_bookings_by_user(current_user_id)
        return [b.to_dict() for b in bookings], 200

    @jwt_required()
    @api.expect(booking_model)
    def post(self):
        from app.services import facade  # IMPORT LOCAL ICI
        current_user_id = get_jwt_identity()
        data = api.payload
        data['user_id'] = current_user_id
        try:
            new_booking = facade.create_booking(data)
            return new_booking.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400