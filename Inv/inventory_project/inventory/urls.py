from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from .views import BuyerViewSet
from .views import TransactionViewSet
from .views import NotificationViewSet
from .views import register_user


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'buyers', BuyerViewSet)
from django.urls import path

urlpatterns = router.urls


urlpatterns += [
    path('auth/signup/', register_user, name='register_user'),
]
