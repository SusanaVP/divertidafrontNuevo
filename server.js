const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(`${__dirname}/divertidafront/dist`));

// Content Security Policy configuration
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline'");
  next();
});

// Send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'divertidafront', 'dist', 'index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);