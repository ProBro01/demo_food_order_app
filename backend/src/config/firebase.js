import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '../../');

// Always load .env from the backend root
dotenv.config({ path: path.join(backendRoot, '.env') });

let db = null;
let auth = null;

try {
  let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
  
  // Resolve path relative to backend directory if not absolute
  if (!path.isAbsolute(serviceAccountPath)) {
    serviceAccountPath = path.resolve(backendRoot, serviceAccountPath);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT) {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
    const serviceAccount = typeof rawKey === 'string' ? JSON.parse(rawKey) : rawKey;
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    db = admin.firestore();
    auth = admin.auth();
    console.log(`✅ Firebase Admin initialized with service account from env (${serviceAccount.project_id}).`);
  } else if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    // Check if app is not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    
    db = admin.firestore();
    auth = admin.auth();
    console.log(`✅ Firebase Admin initialized with service account key (${serviceAccount.project_id}).`);
  } else if (process.env.FIREBASE_PROJECT_ID) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    db = admin.firestore();
    auth = admin.auth();
    console.log(`✅ Firebase Admin initialized with project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  } else {
    console.warn('⚠️  Firebase credentials not provided in .env yet. Running in offline/mock ready mode.');
  }
} catch (error) {
  console.warn('⚠️  Firebase initialization warning:', error.message);
}

export { admin, db, auth };
