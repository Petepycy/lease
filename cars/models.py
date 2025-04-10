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
    image = models.ImageField(upload_to='cars/')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

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
