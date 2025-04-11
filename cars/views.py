from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from decimal import Decimal
from .models import Car, Lease, Employee, SlideshowImage, CarBrand, ProcessStep, ContactSubmission, LeasingParameter
from .serializers import (
    CarSerializer, LeaseSerializer, UserSerializer, EmployeeSerializer, 
    SlideshowImageSerializer, CarBrandSerializer, ProcessStepSerializer, 
    ContactSubmissionSerializer, LeasingParameterSerializer,
    LeasingCalculationRequestSerializer, LeasingCalculationResponseSerializer
)
from django.shortcuts import get_object_or_404

# Create your views here.

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def lease(self, request, pk=None):
        car = self.get_object()
        if not car.is_available:
            return Response({'error': 'Car is not available for lease'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = LeaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(car=car, user=request.user)
            car.is_available = False
            car.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaseViewSet(viewsets.ModelViewSet):
    serializer_class = LeaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lease.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]

class SlideshowImageViewSet(viewsets.ModelViewSet):
    queryset = SlideshowImage.objects.all()
    serializer_class = SlideshowImageSerializer
    permission_classes = [permissions.AllowAny]

class CarBrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarBrand.objects.filter(is_active=True)
    serializer_class = CarBrandSerializer
    permission_classes = [permissions.AllowAny]

class ProcessStepViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProcessStep.objects.filter(is_active=True).order_by('step_number')
    serializer_class = ProcessStepSerializer
    permission_classes = [permissions.AllowAny]

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Thank you for your submission. We will contact you soon.'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class LeasingCalculationView(APIView):
    """API endpoint for calculating leasing rates"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, format=None):
        """
        Calculate leasing rates based on car and parameters.
        
        Parameters:
        - car_id: ID of the car to lease
        - initial_payment_percent: Percentage of initial payment (0-100)
        - contract_months: Length of contract in months
        - annual_mileage: Annual mileage limit in km
        - package_type: 'basic' or 'comfort'
        - leasing_type: 'rental', 'consumer', or 'cash'
        
        Returns:
        - monthly_rate: Monthly payment in PLN
        - initial_payment_value: Initial payment value in PLN
        """
        # Validate request data
        serializer = LeasingCalculationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract validated data
        data = serializer.validated_data
        car_id = data['car_id']
        initial_payment_percent = data['initial_payment_percent']
        contract_months = data['contract_months']
        annual_mileage = data['annual_mileage']
        package_type = data['package_type']
        leasing_type = data['leasing_type']
        
        # Get car or return 404
        try:
            car = Car.objects.get(pk=car_id)
        except Car.DoesNotExist:
            return Response(
                {'error': 'Car not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get leasing parameters or create default ones
        try:
            params = LeasingParameter.objects.get(
                leasing_type=leasing_type,
                package_type=package_type,
                is_active=True
            )
        except LeasingParameter.DoesNotExist:
            # Use default parameters if specific ones don't exist
            params = LeasingParameter(
                leasing_type=leasing_type,
                package_type=package_type,
                base_rate_multiplier=Decimal('1.0'),
                annual_mileage_factor=Decimal('0.02'),
                contract_length_factor=Decimal('0.015'),
                initial_payment_discount=Decimal('0.01'),
                package_base_cost=Decimal('0.00')
            )
        
        # Calculate monthly rate
        base_price = car.price
        
        # Reference values (used to calculate relative impacts)
        ref_mileage = Decimal('30000')  # 30,000 km reference
        ref_contract = Decimal('36')  # 36 months reference
        
        # Calculate mileage impact
        mileage_ratio = Decimal(annual_mileage) / ref_mileage
        mileage_impact = (mileage_ratio - Decimal('1.0')) * params.annual_mileage_factor
        
        # Calculate contract length impact
        contract_ratio = ref_contract / Decimal(contract_months)
        contract_impact = (contract_ratio - Decimal('1.0')) * params.contract_length_factor
        
        # Calculate initial payment discount
        payment_discount = Decimal(initial_payment_percent) * params.initial_payment_discount / Decimal('100.0')
        
        # Package impact (comfort package costs more)
        package_cost = params.package_base_cost
        
        # Base monthly rate calculation (simplified)
        monthly_base = base_price / Decimal(contract_months)
        
        # Apply all factors
        rate_multiplier = params.base_rate_multiplier + mileage_impact + contract_impact - payment_discount
        monthly_rate = (monthly_base * rate_multiplier) + (package_cost / Decimal(contract_months))
        
        # Calculate initial payment
        initial_payment_value = (base_price * Decimal(initial_payment_percent)) / Decimal('100.0')
        
        # Calculate total lease cost (optional)
        total_lease_cost = (monthly_rate * Decimal(contract_months)) + initial_payment_value
        
        # Round to whole numbers for display
        monthly_rate = round(monthly_rate)
        initial_payment_value = round(initial_payment_value)
        total_lease_cost = round(total_lease_cost)
        
        # Prepare the response
        response_data = {
            'monthly_rate': monthly_rate,
            'initial_payment_value': initial_payment_value,
            'total_lease_cost': total_lease_cost,
            'car_details': {
                'id': car.id,
                'make': car.make,
                'model': car.model,
                'year': car.year,
                'price': car.price
            }
        }
        
        # Validate output data
        response_serializer = LeasingCalculationResponseSerializer(data=response_data)
        if response_serializer.is_valid():
            return Response(response_serializer.validated_data)
        else:
            # Fallback in case of serialization error
            return Response(response_data)
