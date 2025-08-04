#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inventory_project.settings')

# Initialize Django
django.setup()

from django.conf import settings
from django.db import connection

print("=== DJANGO SETTINGS VERIFICATION ===")
print()

print("1. Database Configuration:")
db_config = settings.DATABASES['default']
print(f"   Engine: {db_config['ENGINE']}")
print(f"   Name: {db_config['NAME']}")
print(f"   User: {db_config['USER']}")
print(f"   Host: {db_config['HOST']}")
print(f"   Port: {db_config['PORT']}")
print()

print("2. Database Connection Test:")
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"   ✓ Connected to: {version}")
        
        cursor.execute("SELECT current_database();")
        current_db = cursor.fetchone()[0]
        print(f"   ✓ Current database: {current_db}")
        
        cursor.execute("SELECT current_user;")
        current_user = cursor.fetchone()[0]
        print(f"   ✓ Connected as user: {current_user}")
except Exception as e:
    print(f"   ✗ Database connection failed: {e}")
print()

print("3. Installed Apps:")
for app in settings.INSTALLED_APPS:
    print(f"   - {app}")
print()

print("4. CORS Configuration:")
print(f"   Allowed Origins: {settings.CORS_ALLOWED_ORIGINS}")
print(f"   Allow Credentials: {settings.CORS_ALLOW_CREDENTIALS}")
print(f"   Allow All Origins: {settings.CORS_ALLOW_ALL_ORIGINS}")
print()

print("5. REST Framework Configuration:")
if hasattr(settings, 'REST_FRAMEWORK'):
    for key, value in settings.REST_FRAMEWORK.items():
        print(f"   {key}: {value}")
print()

print("6. Custom User Model:")
print(f"   AUTH_USER_MODEL: {getattr(settings, 'AUTH_USER_MODEL', 'Default Django User')}")
print()

print("7. Security Settings:")
print(f"   DEBUG: {settings.DEBUG}")
print(f"   ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
print(f"   SECRET_KEY: {'*' * 20} (hidden)")
