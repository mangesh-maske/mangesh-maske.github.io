const http = require('http');

const app = require('./app');

const port = 3005;

const server = http.createServer(app);

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
 });

// server.listen(port);
app.listen(port, () => console.log('Example app listening on port 3005!'))
