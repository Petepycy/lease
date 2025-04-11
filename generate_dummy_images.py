import os
from PIL import Image, ImageDraw, ImageFont
import random

# Create temp_seed_images directory if it doesn't exist
if not os.path.exists('temp_seed_images'):
    os.makedirs('temp_seed_images')

# Generate car images
for i in range(10):
    # Create a new image with a random color background
    width, height = 800, 600
    r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
    image = Image.new('RGB', (width, height), (r, g, b))
    draw = ImageDraw.Draw(image)
    
    # Add text to the image
    text = f"Car Image {i+1}"
    # Use default font
    draw.text((width/2-100, height/2-20), text, fill=(255, 255, 255))
    
    # Save the image
    image.save(f'temp_seed_images/car_{i+1}.jpg')

# Generate employee images
for i in range(4):
    # Create a new image with a random color background
    width, height = 400, 400
    r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
    image = Image.new('RGB', (width, height), (r, g, b))
    draw = ImageDraw.Draw(image)
    
    # Add text to the image
    text = f"Employee {i+1}"
    # Use default font
    draw.text((width/2-100, height/2-20), text, fill=(255, 255, 255))
    
    # Save the image
    image.save(f'temp_seed_images/employee_{i+1}.jpg')

# Generate slideshow images
for i in range(5):
    # Create a new image with a random color background
    width, height = 1200, 600
    r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
    image = Image.new('RGB', (width, height), (r, g, b))
    draw = ImageDraw.Draw(image)
    
    # Add text to the image
    text = f"Slideshow {i+1}"
    # Use default font
    draw.text((width/2-100, height/2-20), text, fill=(255, 255, 255))
    
    # Save the image
    image.save(f'temp_seed_images/slideshow_{i+1}.jpg')

print("Generated dummy images in temp_seed_images directory.") 