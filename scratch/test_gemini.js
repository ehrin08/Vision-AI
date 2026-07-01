const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const key = process.env.EXPO_PUBLIC_GEMINI_KEY;

const dummyBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

async function testWithQueryParam() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Hello, respond with yes if you read this.' },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: dummyBase64
                }
              }
            ]
          }
        ]
      })
    });
    console.log('Query Param Status:', response.status);
    const body = await response.text();
    console.log('Query Param Body:', body.substring(0, 500));
  } catch (err) {
    console.error('Query Param Error:', err);
  }
}

async function testWithHeader() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'Hello, respond with yes if you read this.' },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: dummyBase64
                }
              }
            ]
          }
        ]
      })
    });
    console.log('Header Status:', response.status);
    const body = await response.text();
    console.log('Header Body:', body.substring(0, 500));
  } catch (err) {
    console.error('Header Error:', err);
  }
}

async function run() {
  console.log('Running query param test...');
  await testWithQueryParam();
  console.log('\nRunning header test...');
  await testWithHeader();
}

run();
