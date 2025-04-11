from django.core.management.base import BaseCommand
from cars.models import ProcessStep

class Command(BaseCommand):
    help = 'Seeds the database with initial process steps'

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed process steps...')

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