const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)
var path = require('path')

let bodyParser  = require( 'body-parser' )
app.use(express.static(path.join(__dirname, 'public')));
app.use( bodyParser({ extended: false }) )

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/landing-page.html')
});

let users = []

app.get('/chat', (request, response) => {
    response.sendFile(__dirname + '/index.html')
});

app.post( '/submit-user-info', ( req, res ) => {
    res.redirect('/chat')
    console.log(req.body)
    users.push({nickname : req.body.nickname ,
                colour : req.body.colour})
});



io.on('connection', (socket) => {

    socket.on('send-message', (msg) => {
        
        io.emit('send-message', msg);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

