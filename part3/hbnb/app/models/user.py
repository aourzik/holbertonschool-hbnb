#!/usr/bin/env python3
import re
from .base_model import BaseModel

class User(BaseModel):
    def __init__(self, first_name, last_name, email, password=None, is_admin=False):
        super().__init__()
        self._password = password
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin

    @property
    def first_name(self):
        return self._first_name

    @property
    def last_name(self):
        return self._last_name

    @property
    def email(self):
        return self._email

    @property
    def is_admin(self):
        return self._is_admin

    @property
    def password(self):
        return self._password
    
    @first_name.setter
    def first_name(self, value):
        if not isinstance(value, str):
            raise TypeError("First name must be a string")
        if not value.strip():
            raise ValueError("First name cannot be empty")
        if len(value) > 50:
            raise ValueError("First name must be at most 50 characters")
        self._first_name = value
    
    @last_name.setter
    def last_name(self, value):
        if not isinstance(value, str):
            raise TypeError("Last name must be a string")
        if not value.strip():
            raise ValueError("Last name cannot be empty")
        if len(value) > 50:
            raise ValueError("Last name must be at most 50 characters")
        self._last_name = value
    
    @email.setter
    def email(self, value):
        if not isinstance(value, str):
            raise TypeError("Email must be a string")
        if not value.strip():
            raise ValueError("Email cannot be empty")
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise ValueError("Invalid email format")
        self._email = value

    @is_admin.setter
    def is_admin(self, value):
        if not isinstance(value, bool):
            raise TypeError("is_admin must be a boolean")
        self._is_admin = value

    @password.setter
    def password(self, value):
        if not isinstance(value, str):
            raise TypeError("Password must be a string")
        if not value:
            raise ValueError("Password cannot be empty")
        self._password = value

    def hash_password(self, password):
        """Hashes the password before storing it."""
        from app import bcrypt
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        from app import bcrypt
        return bcrypt.check_password_hash(self.password, password)

    def __str__(self):
        """Return a readable string representation of the User."""
        return f"[User] {self.first_name} {self.last_name} ({self.id})"

    def __repr__(self):
        """Return the official string representation of the User."""
        return f"User(id='{self.id}', email='{self.email}')"
