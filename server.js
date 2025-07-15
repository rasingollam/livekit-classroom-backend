const app = require('./src/app');
const env = require('./src/config/env');

// Start the server
app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  
  // Environment variables check
  if (!env.livekitApiKey) {
    console.error('ERROR: LIVEKIT_API_KEY is MISSING or empty in .env file!');
  } else {
    console.log(`API Key Loaded. Starts with: ${env.livekitApiKey.substring(0, 4)}...`);
  }

  if (!env.livekitApiSecret) {
    console.error('ERROR: LIVEKIT_API_SECRET is MISSING or empty in .env file!');
  } else {
    console.log('API Secret is Loaded.');
  }
  
  if (!env.livekitUrl) {
    console.error('ERROR: LIVEKIT_URL is MISSING or empty in .env file!');
  } else {
    console.log(`LiveKit URL: ${env.livekitUrl}`);
  }
});