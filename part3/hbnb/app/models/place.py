#!/usr/bin/env python3
from app import db
from app.models.base_model import BaseModel

place_amenity = db.Table(
    'place_amenity',
    db.Column('place_id', db.String(36), db.ForeignKey('places.id'), primary_key=True),
    db.Column('amenity_id', db.String(36), db.ForeignKey('amenities.id'), primary_key=True)
)


class Place(BaseModel):
    __tablename__ = 'places'

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    reviews = db.relationship('Review', backref='place', lazy=True, cascade='all, delete-orphan')
    amenities = db.relationship(
        'Amenity',
        secondary=place_amenity,
        lazy='subquery',
        backref=db.backref('places', lazy=True)
    )

    def __init__(self, title, description=None, price=0.0, latitude=0.0,
                longitude=0.0, owner_id=None):
        super().__init__()

        if not isinstance(title, str) or not title.strip():
            raise ValueError("title is required and must be a non-empty string")
        if len(title.strip()) > 100:
            raise ValueError("title must be 100 characters or less")

        if description is not None and not isinstance(description, str):
            raise TypeError("description must be a string or None")

        try:
            price = float(price)
        except (TypeError, ValueError):
            raise TypeError("price must be a float")
        if price <= 0:
            raise ValueError("price must be a positive value")

        try:
            latitude = float(latitude)
        except (TypeError, ValueError):
            raise TypeError("latitude must be a float")
        if latitude < -90.0 or latitude > 90.0:
            raise ValueError("latitude must be between -90 and 90")

        try:
            longitude = float(longitude)
        except (TypeError, ValueError):
            raise TypeError("longitude must be a float")
        if longitude < -180.0 or longitude > 180.0:
            raise ValueError("longitude must be between -180 and 180")

        if not owner_id or not isinstance(owner_id, str):
            raise ValueError("owner_id is required")

        self.title = title.strip()
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner_id = owner_id

    def update(self, data):
        if "title" in data:
            title = data["title"]
            if not isinstance(title, str) or not title.strip():
                raise ValueError("title is required and must be a non-empty string")
            if len(title.strip()) > 100:
                raise ValueError("title must be 100 characters or less")
            self.title = title.strip()

        if "description" in data:
            description = data["description"]
            if description is not None and not isinstance(description, str):
                raise TypeError("description must be a string or None")
            self.description = description

        if "price" in data:
            try:
                price = float(data["price"])
            except (TypeError, ValueError):
                raise TypeError("price must be a float")
            if price <= 0:
                raise ValueError("price must be a positive value")
            self.price = price

        if "latitude" in data:
            try:
                latitude = float(data["latitude"])
            except (TypeError, ValueError):
                raise TypeError("latitude must be a float")
            if latitude < -90.0 or latitude > 90.0:
                raise ValueError("latitude must be between -90 and 90")
            self.latitude = latitude

        if "longitude" in data:
            try:
                longitude = float(data["longitude"])
            except (TypeError, ValueError):
                raise TypeError("longitude must be a float")
            if longitude < -180.0 or longitude > 180.0:
                raise ValueError("longitude must be between -180 and 180")
            self.longitude = longitude

    def add_review(self, review):
        """Add a review to the place."""
        from .review import Review
        if not (isinstance(review, Review)):
            raise TypeError("review must be a Review")
        if review not in self.reviews:
            self.reviews.append(review)
            self.save()

    def add_amenity(self, amenity):
        """Add an amenity to the place."""
        from .amenity import Amenity
        if not (isinstance(amenity, Amenity)):
            raise TypeError("amenity must be an Amenity")
        if amenity not in self.amenities:
            self.amenities.append(amenity)
            self.save()

    def remove_review(self, review):
        """Remove a review from the place."""
        if review in self.reviews:
            self.reviews.remove(review)
            self.save()

    def remove_amenity(self, amenity):
        """Remove an amenity from the place."""
        if amenity in self.amenities:
            self.amenities.remove(amenity)
            self.save()

    def to_dict(self):
        data = super().to_dict()
        if 'owner_id' in data:
            del data['owner_id']

        owner_dict = self.owner.to_dict()
        owner_dict.pop("password", None)
        data["owner"] = owner_dict
        data["amenities"] = [amenity.to_dict() for amenity in self.amenities]

        return data
