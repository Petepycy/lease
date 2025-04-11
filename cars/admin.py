from django.contrib import admin
from .models import Car, Lease, Employee, SlideshowImage, CarBrand, ProcessStep, ContactSubmission, LeasingParameter, CarImage

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1
    fields = ('image', 'caption', 'is_default', 'display_order')

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'price', 'is_available')
    list_filter = ('make', 'year', 'is_available')
    search_fields = ('make', 'model', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [CarImageInline]
    fieldsets = (
        ('Car Information', {
            'fields': ('make', 'model', 'year', 'price', 'color', 'mileage', 'is_available')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(CarImage)
class CarImageAdmin(admin.ModelAdmin):
    list_display = ('car', 'caption', 'is_default', 'display_order', 'created_at')
    list_editable = ('is_default', 'display_order')
    list_filter = ('is_default', 'car__make', 'car__model')
    search_fields = ('car__make', 'car__model', 'caption')
    ordering = ('car', '-is_default', 'display_order')

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

@admin.register(SlideshowImage)
class SlideshowImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'image', 'active', 'order')
    list_editable = ('active', 'order')
    search_fields = ('title', 'description')
    list_filter = ('active',)

@admin.register(CarBrand)
class CarBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'display_order', 'created_at')
    list_editable = ('is_active', 'display_order')
    search_fields = ('name',)
    list_filter = ('is_active',)
    ordering = ('display_order', 'name')

@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ('step_number', 'title', 'is_active', 'created_at', 'updated_at')
    list_editable = ('is_active',)
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('step_number',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('step_number', 'title', 'description')
        }),
        ('Visual Elements', {
            'fields': ('icon',),
            'description': 'Enter FontAwesome icon class (e.g., fas fa-car)'
        }),
        ('Status', {
            'fields': ('is_active',),
            'description': 'Toggle to show/hide this step on the website'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    readonly_fields = ('created_at', 'updated_at')

@admin.register(LeasingParameter)
class LeasingParameterAdmin(admin.ModelAdmin):
    list_display = ('leasing_type', 'package_type', 'base_rate_multiplier', 'is_active')
    list_filter = ('leasing_type', 'package_type', 'is_active')
    search_fields = ('leasing_type', 'package_type')
    fieldsets = (
        (None, {
            'fields': ('leasing_type', 'package_type', 'is_active')
        }),
        ('Calculation Parameters', {
            'fields': ('base_rate_multiplier', 'annual_mileage_factor', 
                      'contract_length_factor', 'initial_payment_discount', 'package_base_cost')
        }),
    )

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_processed')
    list_filter = ('is_processed', 'created_at', 'preferred_contact')
    search_fields = ('name', 'email', 'phone', 'subject', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('is_processed',)
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'preferred_contact')
        }),
        ('Message Details', {
            'fields': ('subject', 'message', 'preferred_vehicle', 'budget_range')
        }),
        ('Status', {
            'fields': ('is_processed', 'created_at')
        })
    )
