import fetch from 'node-fetch';
import FormData from 'form-data';
import { createReadStream, writeFileSync } from 'fs';
import { basename } from 'path';

const inputPath = 'image.jpg';
const formData = new FormData();
formData.append('size', 'auto');
formData.append('image_file', createReadStream(inputPath), basename(inputPath));

fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  body: formData,
  headers: {
    'X-Api-Key': process.env.API_Key,
    ...formData.getHeaders(),
  },
})
  .then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`Error: ${response.status} ${response.statusText}`));
    }
    return response.arrayBuffer();
  })
  .then((buffer) => {
    writeFileSync('no-bg.png', Buffer.from(buffer));
  })
  .catch((error) => {
    console.error('Request failed:', error);
  });
