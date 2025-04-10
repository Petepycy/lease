from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, LeaseViewSet, UserViewSet, EmployeeViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'leases', LeaseViewSet, basename='lease')
router.register(r'users', UserViewSet)
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 