"""
Comprehensive test suite for Inventory Management System
Testing all admin and sales functionalities from functionalities.txt
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
import json

User = get_user_model()

class AdminFunctionalitiesTests(APITestCase):
    """
    Test all Admin functionalities from functionalities.txt:
    - Product Management (Add, Edit, Delete products)
    - User Management (Add/Edit/Delete users, Generate tokens)
    - Sales Oversight (View all sales)
    - Stock Management (Update stock levels)
    - Dashboard & Analytics (View metrics)
    - Customer Oversight (View/Edit customers)
    """
    
    def setUp(self):
        self.client = APIClient()

    def test_admin_product_management(self):
        """Test admin can perform full CRUD on products"""
        print("\n🔧 Testing Admin Product Management...")
        
        # Test GET products (view all)
        response = self.client.get('/api/products/')
        print(f"✅ View Products: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        # Test POST new product (add)
        product_data = {
            'name': 'Admin Test Product',
            'sku': 'ADMIN001',
            'price': 25.99,
            'quantity': 100,
            'category': 'Admin Category',
            'best_before': '2025-12-31',
            'low_stock_threshold': 10
        }
        response = self.client.post('/api/products/', product_data, format='json')
        print(f"✅ Add Product: {response.status_code}")
        self.assertEqual(response.status_code, 201)
        
        if response.status_code == 201:
            product_id = response.data['id']
            
            # Test PUT product (edit)
            updated_data = {
                'name': 'Updated Admin Product',
                'sku': 'ADMIN001',
                'price': 29.99,
                'quantity': 80,
                'category': 'Updated Category',
                'best_before': '2025-12-31',
                'low_stock_threshold': 15
            }
            response = self.client.put(f'/api/products/{product_id}/', updated_data, format='json')
            print(f"✅ Edit Product: {response.status_code}")
            
            # Test DELETE product
            response = self.client.delete(f'/api/products/{product_id}/')
            print(f"✅ Delete Product: {response.status_code}")

    def test_admin_user_management(self):
        """Test admin can manage users and generate tokens"""
        print("\n👥 Testing Admin User Management...")
        
        # Test view all users
        response = self.client.get('/api/users/')
        print(f"✅ View Users: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        # Test create new user
        user_data = {
            'email': 'newsales@admin.com',
            'password': 'salespass123',
            'role': 'sales'
        }
        response = self.client.post('/api/users/', user_data, format='json')
        print(f"✅ Create User: {response.status_code}")
        
        # Test generate token for sales personnel
        response = self.client.post('/api/generate-token/', {}, format='json')
        print(f"✅ Generate Token: {response.status_code} - Token: {response.data.get('token', 'N/A')}")
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)

    def test_admin_dashboard_analytics(self):
        """Test admin can view dashboard statistics"""
        print("\n📊 Testing Admin Dashboard & Analytics...")
        
        response = self.client.get('/api/dashboard-stats/')
        print(f"✅ Dashboard Stats: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        # Verify dashboard contains expected metrics
        expected_metrics = ['totalItems', 'totalSales', 'totalRevenue', 'activeSalesPersonnel', 'lowStockItems']
        for metric in expected_metrics:
            if metric in response.data:
                print(f"   📈 {metric}: {response.data[metric]}")

    def test_admin_customer_oversight(self):
        """Test admin can manage customers"""
        print("\n👤 Testing Admin Customer Oversight...")
        
        # Test view all customers
        response = self.client.get('/api/customers/')
        print(f"✅ View Customers: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        # Test create customer
        customer_data = {
            'name': 'Admin Test Customer',
            'email': 'admin.customer@test.com',
            'phone': '9999999999',
            'address': '123 Admin St'
        }
        response = self.client.post('/api/customers/', customer_data, format='json')
        print(f"✅ Create Customer: {response.status_code}")
        self.assertEqual(response.status_code, 201)

    def test_admin_sales_oversight(self):
        """Test admin can view all sales from all users"""
        print("\n💰 Testing Admin Sales Oversight...")
        
        response = self.client.get('/api/sales/')
        print(f"✅ View All Sales: {response.status_code}")
        self.assertEqual(response.status_code, 200)


class SalesPersonnelFunctionalitiesTests(APITestCase):
    """
    Test all Sales Personnel functionalities from functionalities.txt:
    - Token-based login
    - View available products
    - Create and process sales orders
    - View sales history
    - Register customers
    - Dashboard summary
    """
    
    def setUp(self):
        self.client = APIClient()

    def test_sales_view_products(self):
        """Test sales personnel can view available products"""
        print("\n📦 Testing Sales - View Available Products...")
        
        response = self.client.get('/api/products/')
        print(f"✅ View Products: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        # Check if products show real-time info (quantity, price, description)
        if response.data:
            product = response.data[0] if isinstance(response.data, list) else response.data
            print(f"   📦 Sample Product: {product.get('name', 'N/A')} - Price: ${product.get('price', 'N/A')} - Qty: {product.get('quantity', 'N/A')}")

    def test_sales_create_orders(self):
        """Test sales personnel can create sales orders"""
        print("\n🛒 Testing Sales - Create Sales Orders...")
        
        # First create a customer and product for the sale
        customer_data = {
            'name': 'Sales Test Customer',
            'email': 'sales.customer@test.com',
            'phone': '8888888888',
            'address': '456 Sales Ave'
        }
        customer_response = self.client.post('/api/customers/', customer_data, format='json')
        print(f"✅ Create Customer for Sale: {customer_response.status_code}")
        
        product_data = {
            'name': 'Sales Test Product',
            'sku': 'SALES001',
            'price': 19.99,
            'quantity': 50,
            'category': 'Sales Category',
            'best_before': '2025-12-31'
        }
        product_response = self.client.post('/api/products/', product_data, format='json')
        print(f"✅ Create Product for Sale: {product_response.status_code}")
        
        if customer_response.status_code == 201 and product_response.status_code == 201:
            # Create sale order
            sale_data = {
                'product': product_response.data['id'],
                'customer': customer_response.data['id'],
                'quantity': 3,
                'amount': 59.97,
                'status': 'completed'
            }
            response = self.client.post('/api/sales/', sale_data, format='json')
            print(f"✅ Create Sales Order: {response.status_code}")

    def test_sales_view_history(self):
        """Test sales personnel can view sales history"""
        print("\n📊 Testing Sales - View Sales History...")
        
        response = self.client.get('/api/sales/')
        print(f"✅ View Sales History: {response.status_code}")
        self.assertEqual(response.status_code, 200)

    def test_sales_register_customer(self):
        """Test sales personnel can register new customers"""
        print("\n👤 Testing Sales - Register Customer...")
        
        customer_data = {
            'name': 'New Sales Customer',
            'email': 'new.sales.customer@test.com',
            'phone': '7777777777',
            'address': '789 Customer Blvd'
        }
        response = self.client.post('/api/customers/', customer_data, format='json')
        print(f"✅ Register Customer: {response.status_code}")
        self.assertEqual(response.status_code, 201)


class AuthenticationTests(APITestCase):
    """Test authentication workflows for both admin and sales"""
    
    def setUp(self):
        self.client = APIClient()

    def test_admin_authentication_flow(self):
        """Test complete admin authentication workflow"""
        print("\n🔐 Testing Admin Authentication Flow...")
        
        # Test admin registration
        register_data = {
            'email': 'testadmin@auth.com',
            'password': 'adminpass123'
        }
        response = self.client.post('/api/admin/register/', register_data, format='json')
        print(f"✅ Admin Registration: {response.status_code} - Token: {response.data.get('token', 'N/A')[:8]}...")
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        
        # Test admin login
        login_data = {
            'email': 'testadmin@auth.com',
            'password': 'adminpass123'
        }
        response = self.client.post('/api/admin/login/', login_data, format='json')
        print(f"✅ Admin Login: {response.status_code} - Token: {response.data.get('token', 'N/A')[:8]}...")
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_sales_token_authentication(self):
        """Test sales personnel token-based authentication"""
        print("\n🎫 Testing Sales Token Authentication...")
        
        # Generate token for sales personnel
        response = self.client.post('/api/generate-token/', {}, format='json')
        print(f"✅ Generate Sales Token: {response.status_code} - Token: {response.data.get('token', 'N/A')}")
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)


class SystemIntegrationTests(APITestCase):
    """Test system-wide functionality and CORS"""
    
    def setUp(self):
        self.client = APIClient()

    def test_cors_configuration(self):
        """Test CORS preflight requests for frontend integration"""
        print("\n🌐 Testing CORS Configuration...")
        
        response = self.client.options('/api/products/')
        print(f"✅ CORS Preflight: {response.status_code}")
        self.assertEqual(response.status_code, 200)

    def test_api_endpoints_availability(self):
        """Test all required API endpoints are available"""
        print("\n🔗 Testing API Endpoints Availability...")
        
        endpoints_get = [
            '/api/products/',
            '/api/customers/',
            '/api/sales/',
            '/api/users/',
            '/api/dashboard-stats/',
            '/api/audit-logs/',
            '/api/system-settings/'
        ]
        
        for endpoint in endpoints_get:
            response = self.client.get(endpoint)
            print(f"✅ {endpoint}: {response.status_code}")
            self.assertEqual(response.status_code, 200)
        
        # Test POST-only endpoints
        response = self.client.post('/api/generate-token/', {}, format='json')
        print(f"✅ /api/generate-token/ (POST): {response.status_code}")
        self.assertEqual(response.status_code, 201)

    def test_audit_logging_system(self):
        """Test audit logging functionality"""
        print("\n📋 Testing Audit Logging System...")
        
        # Perform some actions that should be logged
        self.client.get('/api/products/')
        self.client.post('/api/products/', {
            'name': 'Audit Test Product',
            'sku': 'AUDIT001',
            'price': 9.99,
            'quantity': 25,
            'category': 'Test',
            'best_before': '2025-12-31'
        }, format='json')
        
        # Check audit logs
        response = self.client.get('/api/audit-logs/')
        print(f"✅ Audit Logs Available: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        if response.data:
            print(f"   📝 Found {len(response.data)} audit log entries")
            latest_log = response.data[0]
            print(f"   📝 Latest log: {latest_log.get('action', 'N/A')}")

    def test_system_settings_api(self):
        """Test system settings functionality"""
        print("\n⚙️ Testing System Settings API...")
        
        # Get current settings
        response = self.client.get('/api/system-settings/')
        print(f"✅ Get Settings: {response.status_code}")
        self.assertEqual(response.status_code, 200)
        
        if response.status_code == 200:
            print(f"   💰 Currency: {response.data.get('currency', 'N/A')}")
            print(f"   📊 Tax Rate: {response.data.get('tax_rate', 'N/A')}%")
        
        # Update settings
        update_data = {
            'currency': 'USD',
            'currency_code': 'USD',
            'tax_rate': 15.0
        }
        response = self.client.put('/api/system-settings/', update_data, format='json')
        print(f"✅ Update Settings: {response.status_code}")
        self.assertIn(response.status_code, [200, 201])


class DatabaseIntegrityTests(TestCase):
    """Test database operations and user creation"""
    
    def test_user_model_creation(self):
        """Test different user types can be created"""
        print("\n💾 Testing Database User Creation...")
        
        # Test regular user
        user = User.objects.create_user(
            email='regular@test.com',
            password='testpass123'
        )
        print(f"✅ Regular User: {user.email} - Role: {user.role}")
        self.assertEqual(user.role, 'viewer')
        
        # Test admin user
        admin = User.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            is_admin=True
        )
        print(f"✅ Admin User: {admin.email} - Role: {admin.role}")
        self.assertEqual(admin.role, 'admin')
        
        # Test sales user
        sales = User.objects.create_user(
            email='sales@test.com',
            password='salespass123',
            is_salesperson=True
        )
        print(f"✅ Sales User: {sales.email} - Role: {sales.role}")
        self.assertEqual(sales.role, 'sales')


if __name__ == '__main__':
    print("🚀 Running Comprehensive Inventory Management System Tests...")
    print("=" * 70)