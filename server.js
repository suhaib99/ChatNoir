const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)
var path = require('path')
var session = require('express-session')

let bodyParser = require('body-parser');
const { vary } = require('express/lib/response');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({ extended: false }))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() //+ ":" + today.getSeconds();
var dateTime = time;

//------------------------------------------------------------------------------------------------------

let users = [];
let messages = [];

var randomName = null
function generateName(){
  const {
    uniqueNamesGenerator,
    adjectives,
    animals
  } = require("unique-names-generator");

  randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals]
  });
  return randomName;
}


//make the page asking for username and password the default page
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/landing-page.html')
});

//get user info like username and colour
app.post("/submit-user-info", (req, res) => {
    // req.session.valid = true;
    
    // req.session.valid = null;
    if (req.body.nickname == null || req.body.nickname == "") {
      generateName();
      req.body.nickname = randomName;
    }

    if (req.body.colour == null || req.body.colour == "") {
      req.body.colour = "black";
    }

    users.push({
        nickname: req.body.nickname,
        colour: req.body.colour,
        //id: socket.id,
    });

    res.redirect("/chat");
});

//redirect to chat page
app.get('/chat', (request, response) => {
  // if(request.session.valid){
    response.sendFile(__dirname + '/index.html')
  // }
  // else{
  //   response.redirect('/')
  // }

});


io.on("connection", (socket) => {
  //assign socket ID to the last user
  if (users.length > 0) {
    users[users.length - 1].id = socket.id;
  }
  //console.log(users);

  io.emit("online-users", { users });

  socket.on("send-message", (data) => {
    //console.log(data);

    //compare userId from client side and then send back data to client as object
    var userData = users.filter(function (entry) {
      return entry.id == data.userID;
    })[0];
    console.log(userData);


    // if data.messageInput starts with /nick or /color, update user in userData
    if(data.messageInput.startsWith("/nick")) {
      userData["nickname"] = data.messageInput.replace("/nick ", "")
      io.emit("online-users", { users });
    }
    else if(data.messageInput.startsWith("/colour")) {
      userData["colour"] = data.messageInput.replace("/colour ", "")
      io.emit("online-users", { users });
    }

    else {
      if (messages.length > 200){messages.shift()}
      //sending message and nickname entered back to client
      io.emit("send-message", {
        date: dateTime,
        message: data.messageInput,
        nameInChat: userData.nickname,
        colour: userData.colour
      });

    }
  });

  socket.on("disconnect", () => {
    users = users.filter(function (obj) {
      return obj.id !== socket.id;
    });
    io.emit("online-users", { users });
    console.log(users);
  });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});



