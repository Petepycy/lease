import os
import random
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from cars.models import Car, CarImage, ProcessStep, CarBrand, SlideshowImage, Employee, LeasingParameter

class Command(BaseCommand):
    help = 'Seeds the database with all necessary data including cars, process steps, brands, and more'

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed all data...')
        
        # Run the process steps seeding
        self.seed_process_steps()
        
        # Run the car brands seeding
        self.seed_car_brands()
        
        # Run the cars seeding
        self.seed_cars()
        
        # Run the slideshow images seeding
        self.seed_slideshow_images()
        
        # Run the employees seeding
        self.seed_employees()
        
        # Run the leasing parameters seeding
        self.seed_leasing_parameters()
        
        self.stdout.write(self.style.SUCCESS('Finished seeding all data.'))

    def seed_process_steps(self):
        self.stdout.write('Seeding process steps...')
        
        process_steps = [
            {
                'step_number': 1,
                'title': 'Choose Your Vehicle',
                'description': 'Browse our extensive collection of vehicles and select the perfect one for your needs.',
                'icon': 'fas fa-car',
                'is_active': True
            },
            {
                'step_number': 2,
                'title': 'Apply for Lease',
                'description': 'Fill out our simple application form with your details and requirements.',
                'icon': 'fas fa-file-alt',
                'is_active': True
            },
            {
                'step_number': 3,
                'title': 'Get Approved',
                'description': 'Our team will review your application and get back to you within 24 hours.',
                'icon': 'fas fa-check-circle',
                'is_active': True
            },
            {
                'step_number': 4,
                'title': 'Sign Agreement',
                'description': 'Review and sign the lease agreement with our transparent terms and conditions.',
                'icon': 'fas fa-file-signature',
                'is_active': True
            },
            {
                'step_number': 5,
                'title': 'Drive Away',
                'description': 'Pick up your vehicle and start enjoying the benefits of leasing.',
                'icon': 'fas fa-road',
                'is_active': True
            }
        ]

        created_count = 0
        for step_data in process_steps:
            step, created = ProcessStep.objects.get_or_create(
                step_number=step_data['step_number'],
                defaults=step_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created process step: {step.title}')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} process steps'))

    def seed_car_brands(self):
        self.stdout.write('Seeding car brands...')
        
        brands = [
            {'name': 'Toyota', 'description': 'Reliable and fuel-efficient vehicles', 'website': 'https://www.toyota.com', 'display_order': 1},
            {'name': 'Honda', 'description': 'Innovative and practical automobiles', 'website': 'https://www.honda.com', 'display_order': 2},
            {'name': 'Ford', 'description': 'Built Ford tough', 'website': 'https://www.ford.com', 'display_order': 3},
            {'name': 'Chevrolet', 'description': 'Find new roads', 'website': 'https://www.chevrolet.com', 'display_order': 4},
            {'name': 'BMW', 'description': 'The ultimate driving machine', 'website': 'https://www.bmw.com', 'display_order': 5},
            {'name': 'Mercedes', 'description': 'The best or nothing', 'website': 'https://www.mercedes-benz.com', 'display_order': 6},
            {'name': 'Audi', 'description': 'Vorsprung durch Technik', 'website': 'https://www.audi.com', 'display_order': 7},
            {'name': 'Tesla', 'description': 'Electric vehicles and clean energy', 'website': 'https://www.tesla.com', 'display_order': 8},
            {'name': 'Nissan', 'description': 'Innovation that excites', 'website': 'https://www.nissan.com', 'display_order': 9},
            {'name': 'Hyundai', 'description': 'New thinking, new possibilities', 'website': 'https://www.hyundai.com', 'display_order': 10}
        ]
        
        created_count = 0
        for brand_data in brands:
            brand, created = CarBrand.objects.get_or_create(
                name=brand_data['name'],
                defaults=brand_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created car brand: {brand.name}')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} car brands'))

    def seed_cars(self):
        self.stdout.write('Seeding cars...')
        
        # Path to the temporary image folder relative to the Django project root
        image_folder = os.path.join(settings.BASE_DIR, 'temp_seed_images')
        
        if not os.path.isdir(image_folder):
            self.stderr.write(self.style.ERROR(f'Image folder not found at: {image_folder}'))
            self.stderr.write(self.style.ERROR('Please create the folder and add images.'))
            return
        
        image_files = [f for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))]
        
        if not image_files:
            self.stderr.write(self.style.WARNING('No images found in temp_seed_images folder.'))
            return
        
        # Clear existing cars (optional, uncomment if needed)
        # self.stdout.write('Clearing existing car data...')
        # Car.objects.all().delete()
        
        makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Nissan', 'Hyundai']
        models = {
            'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner'],
            'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline'],
            'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco'],
            'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Camaro'],
            'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'M3'],
            'Mercedes': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'AMG GT'],
            'Audi': ['A4', 'A6', 'Q5', 'Q7', 'RS6', 'e-tron'],
            'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck', 'Roadster'],
            'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Maxima', 'Murano'],
            'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona']
        }
        colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Orange', 'Yellow']
        transmissions = ['Automatic', 'Manual']
        body_types = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck', 'Van', 'Wagon']
        fuel_types = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
        
        # Create 20 dummy cars
        created_count = 0
        for i in range(20):
            make = random.choice(makes)
            model = random.choice(models[make])
            year = random.randint(2018, 2024)
            price = round(random.uniform(20000, 120000), 2)
            mileage = random.randint(0, 60000)
            color = random.choice(colors)
            transmission = random.choice(transmissions)
            body_type = random.choice(body_types)
            fuel_type = random.choice(fuel_types)
            
            # Create a more detailed description
            features = [
                f"{transmission} transmission",
                f"{fuel_type} engine",
                f"{body_type} body style",
                f"{color} exterior",
                "Bluetooth connectivity",
                "Backup camera",
                "Apple CarPlay/Android Auto",
                "Leather seats",
                "Sunroof",
                "Navigation system"
            ]
            
            # Randomly select 4-6 features to include in the description
            selected_features = random.sample(features, random.randint(4, 6))
            features_text = ", ".join(selected_features)
            
            description = f"A {year} {make} {model} in {color}. This {body_type.lower()} comes with {features_text}. "
            description += f"It has {mileage} miles and is in excellent condition. Perfect for {random.choice(['families', 'commuters', 'adventurers', 'business professionals'])}."
            
            try:
                car = Car.objects.create(
                    make=make,
                    model=model,
                    year=year,
                    price=price,
                    mileage=mileage,
                    color=color,
                    description=description,
                    is_available=True,
                )
                
                # Add images to the car if available
                if image_files:
                    # Use a random image from the folder
                    image_filename = random.choice(image_files)
                    image_path = os.path.join(image_folder, image_filename)
                    
                    with open(image_path, 'rb') as f:
                        django_file = File(f, name=image_filename)
                        car_image = CarImage.objects.create(
                            car=car,
                            image=django_file,
                            is_default=True,
                            display_order=0
                        )
                
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Successfully created car: {car}'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Failed to create car: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'Finished seeding. Created {created_count} car entries.'))

    def seed_slideshow_images(self):
        self.stdout.write('Seeding slideshow images...')
        
        # Path to the slideshow images folder
        slideshow_folder = os.path.join(settings.BASE_DIR, 'temp_seed_images')
        
        if not os.path.isdir(slideshow_folder):
            self.stderr.write(self.style.ERROR(f'Slideshow image folder not found at: {slideshow_folder}'))
            return
        
        image_files = [f for f in os.listdir(slideshow_folder) if os.path.isfile(os.path.join(slideshow_folder, f))]
        
        if not image_files:
            self.stderr.write(self.style.WARNING('No images found for slideshow.'))
            return
        
        slideshow_data = [
            {'title': 'Luxury Fleet', 'description': 'Explore our premium selection of luxury vehicles', 'order': 1},
            {'title': 'Family Cars', 'description': 'Perfect vehicles for the whole family', 'order': 2},
            {'title': 'Electric Vehicles', 'description': 'Eco-friendly transportation options', 'order': 3},
            {'title': 'SUVs and Crossovers', 'description': 'Spacious and versatile vehicles for any adventure', 'order': 4},
            {'title': 'Sports Cars', 'description': 'Experience the thrill of high-performance vehicles', 'order': 5}
        ]
        
        created_count = 0
        for i, slide_data in enumerate(slideshow_data):
            if i < len(image_files):
                image_filename = image_files[i]
                image_path = os.path.join(slideshow_folder, image_filename)
                
                try:
                    with open(image_path, 'rb') as f:
                        django_file = File(f, name=image_filename)
                        slide = SlideshowImage.objects.create(
                            title=slide_data['title'],
                            description=slide_data['description'],
                            image=django_file,
                            active=True,
                            order=slide_data['order']
                        )
                        created_count += 1
                        self.stdout.write(f'Created slideshow image: {slide.title}')
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f'Failed to create slideshow image: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} slideshow images'))

    def seed_employees(self):
        self.stdout.write('Seeding employees...')
        
        # Path to the employee images folder
        employee_folder = os.path.join(settings.BASE_DIR, 'temp_seed_images')
        
        if not os.path.isdir(employee_folder):
            self.stderr.write(self.style.ERROR(f'Employee image folder not found at: {employee_folder}'))
            return
        
        image_files = [f for f in os.listdir(employee_folder) if os.path.isfile(os.path.join(employee_folder, f))]
        
        if not image_files:
            self.stderr.write(self.style.WARNING('No images found for employees.'))
            return
        
        employees_data = [
            {
                'name': 'John Smith',
                'position': 'Sales Manager',
                'description': 'With over 15 years of experience in automotive sales, John leads our team with expertise and dedication.',
                'email': 'john.smith@example.com',
                'phone': '(555) 123-4567',
                'linkedin_url': 'https://linkedin.com/in/johnsmith',
                'order': 1
            },
            {
                'name': 'Sarah Johnson',
                'position': 'Leasing Specialist',
                'description': 'Sarah specializes in finding the perfect lease terms for our customers, ensuring a smooth and transparent process.',
                'email': 'sarah.johnson@example.com',
                'phone': '(555) 234-5678',
                'linkedin_url': 'https://linkedin.com/in/sarahjohnson',
                'order': 2
            },
            {
                'name': 'Michael Brown',
                'position': 'Customer Service Representative',
                'description': 'Michael is dedicated to providing exceptional customer service and support throughout the leasing journey.',
                'email': 'michael.brown@example.com',
                'phone': '(555) 345-6789',
                'linkedin_url': 'https://linkedin.com/in/michaelbrown',
                'order': 3
            },
            {
                'name': 'Emily Davis',
                'position': 'Finance Manager',
                'description': 'Emily handles all financial aspects of our leasing operations, ensuring competitive rates and terms.',
                'email': 'emily.davis@example.com',
                'phone': '(555) 456-7890',
                'linkedin_url': 'https://linkedin.com/in/emilydavis',
                'order': 4
            }
        ]
        
        created_count = 0
        for i, employee_data in enumerate(employees_data):
            if i < len(image_files):
                image_filename = image_files[i]
                image_path = os.path.join(employee_folder, image_filename)
                
                try:
                    with open(image_path, 'rb') as f:
                        django_file = File(f, name=image_filename)
                        employee = Employee.objects.create(
                            name=employee_data['name'],
                            position=employee_data['position'],
                            description=employee_data['description'],
                            email=employee_data['email'],
                            phone=employee_data['phone'],
                            linkedin_url=employee_data['linkedin_url'],
                            image=django_file,
                            order=employee_data['order']
                        )
                        created_count += 1
                        self.stdout.write(f'Created employee: {employee.name}')
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f'Failed to create employee: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} employees'))

    def seed_leasing_parameters(self):
        self.stdout.write('Seeding leasing parameters...')
        
        leasing_types = ['rental', 'consumer', 'cash']
        package_types = ['basic', 'comfort']
        
        created_count = 0
        for leasing_type in leasing_types:
            for package_type in package_types:
                # Different base costs for different combinations
                if leasing_type == 'rental':
                    base_cost = 299.99 if package_type == 'basic' else 399.99
                elif leasing_type == 'consumer':
                    base_cost = 199.99 if package_type == 'basic' else 299.99
                else:  # cash
                    base_cost = 99.99 if package_type == 'basic' else 199.99
                
                param, created = LeasingParameter.objects.get_or_create(
                    leasing_type=leasing_type,
                    package_type=package_type,
                    defaults={
                        'base_rate_multiplier': 1.000,
                        'annual_mileage_factor': 0.020,
                        'contract_length_factor': 0.015,
                        'initial_payment_discount': 0.010,
                        'package_base_cost': base_cost,
                        'is_active': True
                    }
                )
                
                if created:
                    created_count += 1
                    self.stdout.write(f'Created leasing parameter: {param}')
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} leasing parameters')) 