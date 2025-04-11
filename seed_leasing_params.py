import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import our models
from cars.models import LeasingParameter
from decimal import Decimal

def seed_leasing_parameters():
    """
    Create default leasing parameters for different combinations of
    leasing types and package types.
    """
    default_params = [
        # Rental + Basic package
        {
            'leasing_type': 'rental',
            'package_type': 'basic',
            'base_rate_multiplier': Decimal('1.05'),
            'annual_mileage_factor': Decimal('0.025'),
            'contract_length_factor': Decimal('0.015'),
            'initial_payment_discount': Decimal('0.008'),
            'package_base_cost': Decimal('50.00'),
        },
        # Rental + Comfort package
        {
            'leasing_type': 'rental',
            'package_type': 'comfort',
            'base_rate_multiplier': Decimal('1.08'),
            'annual_mileage_factor': Decimal('0.025'),
            'contract_length_factor': Decimal('0.015'),
            'initial_payment_discount': Decimal('0.008'),
            'package_base_cost': Decimal('150.00'),
        },
        # Consumer + Basic package
        {
            'leasing_type': 'consumer',
            'package_type': 'basic',
            'base_rate_multiplier': Decimal('1.10'),
            'annual_mileage_factor': Decimal('0.020'),
            'contract_length_factor': Decimal('0.018'),
            'initial_payment_discount': Decimal('0.010'),
            'package_base_cost': Decimal('75.00'),
        },
        # Consumer + Comfort package
        {
            'leasing_type': 'consumer',
            'package_type': 'comfort',
            'base_rate_multiplier': Decimal('1.15'),
            'annual_mileage_factor': Decimal('0.020'),
            'contract_length_factor': Decimal('0.018'),
            'initial_payment_discount': Decimal('0.010'),
            'package_base_cost': Decimal('180.00'),
        },
        # Cash + Basic package
        {
            'leasing_type': 'cash',
            'package_type': 'basic',
            'base_rate_multiplier': Decimal('1.20'),
            'annual_mileage_factor': Decimal('0.015'),
            'contract_length_factor': Decimal('0.020'),
            'initial_payment_discount': Decimal('0.012'),
            'package_base_cost': Decimal('60.00'),
        },
        # Cash + Comfort package
        {
            'leasing_type': 'cash',
            'package_type': 'comfort',
            'base_rate_multiplier': Decimal('1.25'),
            'annual_mileage_factor': Decimal('0.015'),
            'contract_length_factor': Decimal('0.020'),
            'initial_payment_discount': Decimal('0.012'),
            'package_base_cost': Decimal('160.00'),
        },
    ]
    
    count = 0
    for params in default_params:
        # Check if this combination already exists
        existing = LeasingParameter.objects.filter(
            leasing_type=params['leasing_type'],
            package_type=params['package_type']
        ).first()
        
        if existing:
            print(f"Updating {params['leasing_type']} + {params['package_type']}")
            # Update existing parameters
            for key, value in params.items():
                setattr(existing, key, value)
            existing.save()
        else:
            print(f"Creating {params['leasing_type']} + {params['package_type']}")
            # Create new parameters
            LeasingParameter.objects.create(**params)
        count += 1
    
    print(f"Created/updated {count} leasing parameter sets")

if __name__ == "__main__":
    print("Seeding leasing parameters...")
    seed_leasing_parameters()
    print("Done!") 