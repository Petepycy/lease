from rest_framework import serializers
from .models import Car, Lease, Employee, SlideshowImage
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'

class LeaseSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Lease
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'position',
            'image',
            'description',
            'email',
            'phone',
            'linkedin_url',
            'order'
        ]

class SlideshowImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlideshowImage
        fields = ['id', 'title', 'image', 'description', 'active', 'order'] 