from django.urls import path
from .views import AdminRegisterView, AdminLoginView, SalespersonLoginOrRegisterView
# inventory/urls.py
from django.urls import path
from .views import GenerateTokenView, ProductListCreateView, ProductDetailView, CustomerDetailView, CustomerListCreateView
from .views import DashboardStatsView, AuditLogView, SystemSettingsView, SaleListCreateView, NotificationListCreateView
from .views import UserListCreateView, UserDetailView, GenerateUserTokenView

urlpatterns = [
    path('admin/register/', AdminRegisterView.as_view()),
    path('admin/login/', AdminLoginView.as_view()),
    path('salesperson/auth/', SalespersonLoginOrRegisterView.as_view()),
    path('generate-token/', GenerateTokenView.as_view(), name='generate_token'),
    path('products/', ProductListCreateView.as_view(), name='product_list_create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('customers/', CustomerListCreateView.as_view(), name='customer_list_create'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='customer_detail'),
    path('sales/', SaleListCreateView.as_view(), name='sale_list_create'),
    path('users/', UserListCreateView.as_view(), name='user_list_create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('users/generate-token/', GenerateUserTokenView.as_view(), name='generate_user_token'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('audit-logs/', AuditLogView.as_view(), name='audit_log_list'),
    path('notifications/', NotificationListCreateView.as_view(), name='notification_list_create'),
    path('system-settings/', SystemSettingsView.as_view(), name='system_settings'),
]
