from django.contrib import admin
from .models import Car, Lease, Employee

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'price', 'is_available')
    list_filter = ('make', 'year', 'is_available')
    search_fields = ('make', 'model', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Lease)
class LeaseAdmin(admin.ModelAdmin):
    list_display = ('car', 'user', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('car__make', 'car__model', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'email', 'phone', 'linkedin_url', 'order')
    list_editable = ('order',)
    search_fields = ('name', 'position', 'email', 'linkedin_url')
    list_filter = ('position',)
