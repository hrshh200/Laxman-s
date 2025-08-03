const fs = require('fs');
const path = require('path');

const googleServicesBase64 = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesBase64) {
  console.log('No GOOGLE_SERVICES_JSON env var found, skipping.');
  process.exit(0);
}

const filePath = path.resolve(__dirname, '../android/app/google-services.json');

// Create directory if it doesn't exist
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Write the file
fs.writeFileSync(filePath, Buffer.from(googleServicesBase64, 'base64'));

console.log('✅ google-services.json written to android/app/');
