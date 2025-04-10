const images = [
  {
    url: 'https://images.unsplash.com/photo-1560958089-b8a192881cea?w=800&auto=format&fit=crop&q=60',
    filename: 'tesla-model3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
    filename: 'bmw-3series.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1618843479313-40f45e967ae0?w=800&auto=format&fit=crop&q=60',
    filename: 'mercedes-cclass.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60',
    filename: 'hero-bg.jpg'
  }
];

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

images.forEach(image => {
  const file = fs.createWriteStream(path.join(__dirname, image.filename));
  https.get(image.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${image.filename}`);
    });
  }).on('error', err => {
    fs.unlink(image.filename);
    console.error(`Error downloading ${image.filename}: ${err.message}`);
  });
}); 