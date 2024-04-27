const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist','divertidafront', 'browser')));

// Send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist','divertidafront','browser','index.html'));
});

// Default Heroku port
app.listen(process.env.PORT || 5000, () => {
  console.log('Servidor iniciado en el puerto 5000');
});
