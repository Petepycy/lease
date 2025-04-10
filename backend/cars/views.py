from rest_framework import viewsets, permissions
from .models import Car, Employee, SlideshowImage
from .serializers import CarSerializer, EmployeeSerializer, SlideshowImageSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view cars

    def get_queryset(self):
        queryset = Car.objects.all()
        # Add filtering logic here if needed
        return queryset

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny] 

class SlideshowImageViewSet(viewsets.ModelViewSet):
    queryset = SlideshowImage.objects.all()
    serializer_class = SlideshowImageSerializer
    permission_classes = [permissions.AllowAny] 