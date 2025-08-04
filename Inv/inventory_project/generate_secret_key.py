#!/usr/bin/env python
"""
Generate a new Django secret key for production use.
Run this script and copy the output to your .env.production file.
"""

import secrets
import string

def generate_secret_key(length=50):
    """Generate a random secret key for Django."""
    characters = string.ascii_letters + string.digits + '!@#$%^&*()_+-=[]{}|;:,.<>?'
    return ''.join(secrets.choice(characters) for _ in range(length))

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("Generated Django Secret Key:")
    print("=" * 50)
    print(secret_key)
    print("=" * 50)
    print("\nAdd this to your .env.production file:")
    print(f"DJANGO_SECRET_KEY={secret_key}")
