from django.db import models

class Car(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mileage = models.PositiveIntegerField()
    transmission = models.CharField(max_length=20)
    body_type = models.CharField(max_length=20)
    color = models.CharField(max_length=30)
    description = models.TextField()
    image = models.ImageField(upload_to='cars/')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

class Employee(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    image = models.ImageField(upload_to='employees/')
    description = models.TextField()
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    linkedin_url = models.URLField(max_length=200, blank=True)
    order = models.IntegerField(default=0)  # For ordering employees on the page

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.position}" 