var socket = io();

var messages = document.getElementById("messages");
var messageForm = document.getElementById("message-form");
var messageInput = document.getElementById("message-input");

var nameColourForm = document.getElementById("user-information-form");

var nameEntered = document.getElementById("nickname-input");
var colourEntered = document.getElementById("colour-input");
let userID = null;

//socket Id will be assigned to client as "UserID" upon connection
 socket.on('connect', function() {
    userID = socket.id;
  });

/*
 Once chat is submitted, prevent default action of refreshing the page,
 emit the message to server
 clear out the message box field
 */
messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (messageInput.value) {
    //send message text and user's ID to server and then clear message box
    socket.emit("send-message", {messageInput : messageInput.value, userID} );
    messageInput.value = "";
  }
});

/*
when a chat message is received, display it as a list item.
 */
socket.on("send-message", function (data) {
  let displayMessage = `${data.date} ${data.nameInChat} : ${data.message}`
  appendMessage( {message: displayMessage, colour: data.colour} )
});
socket.on("online-users", userData =>{
  document.getElementById("online-users").innerHTML = "";
  appendUsers(userData)
  //console.log(data.users);
})

//create a list item and append messages
function appendMessage(data){
    var messageItem = document.createElement("li");
    messageItem.textContent = data.message;
    messageItem.style.color = data.colour;
    messages.prepend(messageItem);
    document.getElementById("messages").scrollTo(0, 0)
}

function appendUsers(userData) {
  
  for(let i = 0; i < userData.users.length ; i++){
    let user = userData.users[i]
    var listItem = document.createElement('li')
    
    listItem.style.color = user.colour
    listItem.textContent = user.nickname
    document.getElementById("online-users").appendChild(listItem)
  }
}
