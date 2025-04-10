from django.contrib import admin
from .models import Car, Employee, SlideshowImage

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'email', 'phone', 'linkedin_url', 'order')
    list_editable = ('order',)
    search_fields = ('name', 'position', 'email', 'linkedin_url')
    list_filter = ('position',)

@admin.register(SlideshowImage)
class SlideshowImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'image', 'description') 