import os
import random
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from cars.models import Car

class Command(BaseCommand):
    help = 'Seeds the database with car data and images from temp_seed_images folder'

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed car data...')

        # Path to the temporary image folder relative to the Django project root
        image_folder = os.path.join(settings.BASE_DIR, 'images')

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
            'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander'],
            'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
            'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'],
            'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Traverse'],
            'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
            'Mercedes': ['C-Class', 'E-Class', 'GLC', 'GLE'],
            'Audi': ['A4', 'A6', 'Q5', 'Q7'],
            'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
            'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder'],
            'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe']
        }
        colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green']
        transmissions = ['Automatic', 'Manual']
        body_types = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck']

        created_count = 0
        for image_filename in image_files:
            image_path = os.path.join(image_folder, image_filename)

            make = random.choice(makes)
            model = random.choice(models[make])
            year = random.randint(2018, 2024)
            price = round(random.uniform(20000, 80000), 2)
            mileage = random.randint(5000, 60000)
            color = random.choice(colors)
            description = f"A reliable {year} {make} {model} in {color}. Good condition with {mileage} miles."
            transmission = random.choice(transmissions)
            body_type = random.choice(body_types)

            try:
                with open(image_path, 'rb') as f:
                    django_file = File(f, name=image_filename)
                    car = Car.objects.create(
                        make=make,
                        model=model,
                        year=year,
                        price=price,
                        mileage=mileage,
                        color=color,
                        description=description,
                        image=django_file,  # Assign the image file
                        is_available=True,
                        # Add other fields if they exist in your model
                        # transmission=transmission, 
                        # body_type=body_type,
                    )
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Successfully created car: {car}'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Failed to create car for image {image_filename}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Finished seeding. Created {created_count} car entries.')) 