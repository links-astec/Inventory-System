"""
WSGI config for inventory_project for PythonAnywhere deployment.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.

Instructions for PythonAnywhere:
1. Replace 'yourusername' with your actual PythonAnywhere username
2. Upload this file to /home/yourusername/inventory_project/
3. Update the WSGI configuration in your PythonAnywhere web app settings
"""

import os
import sys

# Add your project directory to sys.path
project_home = '/home/yourusername/inventory_project'  # Replace 'yourusername' with your actual username
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inventory_project.settings_production')

# Import Django's WSGI handler
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
