from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, EmployeeViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 