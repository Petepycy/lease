from rest_framework import serializers
from .models import Car, Employee

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = [
            'id',
            'make',
            'model',
            'year',
            'price',
            'mileage',
            'transmission',
            'body_type',
            'color',
            'description',
            'image',
            'is_available'
        ]

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