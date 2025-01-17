require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');

const app = express();
const port = process.env.PORT || 3000;

let counter = 1;
let shortnedUrls = {};

app.use(cors());
app.use(express.urlencoded({ extended: false })); // Built-in body parser for URL-encoded data

// Serve static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Root Route
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Basic API Endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// URL Shortening Endpoint
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // Check if the URL is valid
  if (!validUrl.isWebUri(url)) {
    res.json({ error: 'invalid url' });
    return;
  }

  // Store the original URL and assign a short URL ID
  shortnedUrls[counter] = url;

  res.json({ original_url: url, short_url: counter });
  counter += 1;
  console.log(shortnedUrls);
});

// URL Redirection Endpoint
app.get('/api/shorturl/:id', (req, res) => {
  const urlId = req.params.id;
  const originalUrl = shortnedUrls[urlId];

  if (!originalUrl) {
    res.status(404).json({ error: 'No short URL found for the given ID' });
    return;
  }
  res.redirect(originalUrl);
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
