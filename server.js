const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Content Security Policy configuration
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com");
  next();
});

// Send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Default Heroku port
app.listen(process.env.PORT || 5000, () => {
  console.log('Servidor iniciado en el puerto 5000');
});
