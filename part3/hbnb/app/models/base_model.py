#!/usr/bin/env python3
from app import db
import uuid
from datetime import datetime


class BaseModel(db.Model):
    __abstract__ = True

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def save(self):
        """Persist the current object and refresh its update timestamp."""
        self.updated_at = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        ignored_keys = ['id', 'created_at', 'updated_at']
        for key, value in data.items():
            if key not in ignored_keys and hasattr(self, key) and not callable(getattr(self, key)):
                setattr(self, key, value)
        self.save()

    def to_dict(self):
        result = {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }
        result["created_at"] = self.created_at.isoformat()
        result["updated_at"] = self.updated_at.isoformat()
        return result
