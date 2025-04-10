from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, LeaseViewSet, UserViewSet, EmployeeViewSet, SlideshowImageViewSet

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'leases', LeaseViewSet, basename='lease')
router.register(r'users', UserViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'slideshow-images', SlideshowImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 