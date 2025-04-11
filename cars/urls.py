from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CarViewSet, CarBrandViewSet, EmployeeViewSet, SlideshowImageViewSet, 
    ProcessStepViewSet, ContactSubmissionViewSet, LeasingCalculationView
)

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'brands', CarBrandViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'slideshow-images', SlideshowImageViewSet)
router.register(r'process-steps', ProcessStepViewSet)
router.register(r'contact-submissions', ContactSubmissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('leasing/calculate/', LeasingCalculationView.as_view(), name='leasing-calculate'),
] 