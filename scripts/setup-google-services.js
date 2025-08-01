import * as fs from 'fs';

const fileContent = process.env.GOOGLE_SERVICES_JSON;

if (!fileContent) {
  throw new Error('Missing GOOGLE_SERVICES_JSON env variable');
}

fs.writeFileSync('android/app/google-services.json', Buffer.from(fileContent, 'base64').toString('utf-8'));
