const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)
var path = require('path')
var session = require('express-session')

let bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({ extended: false }))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//------------------------------------------------------------------------------------------------------

let users = [];



//make the page asking for username and password the default page
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/landing-page.html')
});

//redirect to chat page
app.get('/chat', (request, response) => {
    response.sendFile(__dirname + '/index.html')
});

//get user info like username and colour
app.post("/submit-user-info", (req, res) => {
    res.redirect("/chat");
    users.push({
        nickname: req.body.nickname,
        colour: req.body.colour,
        //id: socket.id,
    });
});

io.on("connection", (socket) => {
    //assign ID to the last user
  if (users.length > 0) {
    users[users.length - 1].id = socket.id;
  }
  console.log(users);
  
  socket.on("send-message", (data) => {
    //console.log(data);
    var chatData = users.filter(function(entry) { return entry.id == data.userID; })[0];
    console.log(chatData);  
    io.emit("send-message", {message: data.messageInput, nameInChat : chatData.nickname });
  });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

