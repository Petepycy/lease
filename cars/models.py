from django.db import models
from django.contrib.auth.models import User

class Car(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mileage = models.IntegerField()
    color = models.CharField(max_length=50)
    description = models.TextField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"
    
    def default_image(self):
        """Returns the default image for this car or the first image if no default is set"""
        default_img = self.car_images.filter(is_default=True).first()
        if default_img:
            return default_img.image.url
        # Return first image or None if no images
        first_img = self.car_images.first()
        return first_img.image.url if first_img else None
    
    def get_all_images(self):
        """Returns all images for this car, with default first"""
        # Get the default image first (if any)
        images = list(self.car_images.filter(is_default=True))
        # Then get all non-default images
        images.extend(self.car_images.filter(is_default=False))
        
        # Return image URLs
        return [img.image.url for img in images]

class CarImage(models.Model):
    """Model for storing multiple images for a car"""
    car = models.ForeignKey(Car, related_name='car_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='cars/')
    caption = models.CharField(max_length=200, blank=True, null=True)
    is_default = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['is_default', 'display_order', 'created_at']
        verbose_name = 'Car Image'
        verbose_name_plural = 'Car Images'
        
    def __str__(self):
        return f"Image for {self.car} - {'Default' if self.is_default else 'Additional'}"
    
    def save(self, *args, **kwargs):
        """Ensure only one default image per car"""
        if self.is_default:
            # Set all other images for this car to non-default
            CarImage.objects.filter(car=self.car, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

class LeasingParameter(models.Model):
    """Model for storing parameters that affect leasing calculations"""
    
    LEASING_TYPE_CHOICES = [
        ('rental', 'Rental'),
        ('consumer', 'Consumer Leasing'),
        ('cash', 'Cash Loan')
    ]
    
    PACKAGE_TYPE_CHOICES = [
        ('basic', 'Basic'),
        ('comfort', 'Comfort')
    ]
    
    leasing_type = models.CharField(max_length=20, choices=LEASING_TYPE_CHOICES)
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPE_CHOICES)
    
    # Multipliers and base parameters
    base_rate_multiplier = models.DecimalField(max_digits=5, decimal_places=3, default=1.000)
    annual_mileage_factor = models.DecimalField(max_digits=5, decimal_places=3, default=0.020)
    contract_length_factor = models.DecimalField(max_digits=5, decimal_places=3, default=0.015)
    initial_payment_discount = models.DecimalField(max_digits=5, decimal_places=3, default=0.010)
    
    # Base costs for packages
    package_base_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('leasing_type', 'package_type')
        verbose_name = 'Leasing Parameter'
        verbose_name_plural = 'Leasing Parameters'
    
    def __str__(self):
        return f"{self.get_leasing_type_display()} - {self.get_package_type_display()}"

class Lease(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_payment = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lease for {self.car} by {self.user.username}"

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    image = models.ImageField(upload_to='employees/')
    description = models.TextField()
    email = models.EmailField(blank=True) # Allow blank email
    phone = models.CharField(max_length=20, blank=True) # Allow blank phone
    linkedin_url = models.URLField(max_length=200, blank=True) # Add LinkedIn URL field
    order = models.IntegerField(default=0)  # For ordering employees on the page

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.position}"

class SlideshowImage(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='slideshow/')
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return self.title

class CarBrand(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='brands/', null=True, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

class ProcessStep(models.Model):
    step_number = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, help_text="FontAwesome icon class (e.g., 'fas fa-car')")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['step_number']
        verbose_name = 'Process Step'
        verbose_name_plural = 'Process Steps'

    def __str__(self):
        return f"Step {self.step_number}: {self.title}"

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    preferred_contact = models.CharField(max_length=10, choices=[
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('both', 'Both')
    ])
    subject = models.CharField(max_length=200)
    message = models.TextField()
    preferred_vehicle = models.CharField(max_length=100, blank=True)
    budget_range = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'

    def __str__(self):
        return f"{self.name} - {self.subject} ({self.created_at.strftime('%Y-%m-%d')})"
