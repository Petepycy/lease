from rest_framework import serializers
from .models import Car, CarBrand, Lease, Employee, SlideshowImage, ProcessStep, ContactSubmission, LeasingParameter
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'

class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrand
        fields = ['id', 'name', 'logo', 'description', 'website']

class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = ['step_number', 'title', 'description', 'icon']

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

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = [
            'name', 'email', 'phone', 'preferred_contact',
            'subject', 'message', 'preferred_vehicle', 'budget_range'
        ]

# Add LeasingParameter serializer
class LeasingParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeasingParameter
        fields = '__all__'

# Add a serializer for leasing calculation requests
class LeasingCalculationRequestSerializer(serializers.Serializer):
    car_id = serializers.IntegerField()
    initial_payment_percent = serializers.IntegerField(min_value=0, max_value=100)
    contract_months = serializers.IntegerField(min_value=1, max_value=60)
    annual_mileage = serializers.IntegerField(min_value=5000, max_value=100000)
    package_type = serializers.ChoiceField(choices=['basic', 'comfort'])
    leasing_type = serializers.ChoiceField(choices=['rental', 'consumer', 'cash'])

# Add a serializer for leasing calculation responses
class LeasingCalculationResponseSerializer(serializers.Serializer):
    monthly_rate = serializers.DecimalField(max_digits=10, decimal_places=2)
    initial_payment_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_lease_cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    car_details = serializers.DictField(required=False) 