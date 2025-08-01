const fs = require('fs');
const path = require('path');

const googleServicesBase64 = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesBase64) {
  throw new Error('GOOGLE_SERVICES_JSON environment variable is not defined');
}

const googleServicesJson = Buffer.from(googleServicesBase64, 'base64').toString('utf-8');
const filePath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');

// Ensure the directory exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Write the file
fs.writeFileSync(filePath, googleServicesJson);
console.log('✅ google-services.json created successfully');
