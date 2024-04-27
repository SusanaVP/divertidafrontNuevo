// const path = require('path');
// const express = require('express');
// const app = express();

// // Serve static files
// app.use(express.static(path.join(__dirname, 'divertidafront', 'dist')));

// // Content Security Policy configuration
// // Content Security Policy configuration
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline'; img-src 'self' https://ddivertida-frontend-64b56329e5d5.herokuapp.com/favicon.ico;");
//   next();
// });


// // Send all requests to index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'browser', 'index.html'));
// });

// // Default Heroku port
// app.listen(process.env.PORT || 5000, () => {
//   console.log('Servidor iniciado en el puerto 5000');
// });

// const express = require('express');
// const path = require('path');
// const app = express();

// app.use(express.static(path.join(__dirname,  'src',  'assets')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'src', 'index.html'));
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const app = express();
const path = require('path');

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}
// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});