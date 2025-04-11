from django.db import models

class BackgroundImage(models.Model):
    PAGE_CHOICES = [
        ('contact', 'Contact Page'),
        ('new_cars', 'New Cars Page'),
    ]
    
    page = models.CharField(
        max_length=20,
        choices=PAGE_CHOICES,
        unique=True,
        help_text="Select which page this background is for"
    )
    image = models.ImageField(
        upload_to='backgrounds/',
        help_text="Upload background image (recommended size: 1920x1080px)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only one background per page can be active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Background Image"
        verbose_name_plural = "Background Images"

    def __str__(self):
        return f"{self.get_page_display()} Background"

    def save(self, *args, **kwargs):
        if self.is_active:
            # Deactivate other backgrounds for the same page
            BackgroundImage.objects.filter(page=self.page).exclude(id=self.id).update(is_active=False)
        super().save(*args, **kwargs) 