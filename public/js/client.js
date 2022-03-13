var socket = io();

var messages = document.getElementById("messages");
var messageForm = document.getElementById("message-form");
var messageInput = document.getElementById("message-input");

var nameColourForm = document.getElementById("user-information-form");

var nameEntered = document.getElementById("nickname-input");
var colourEntered = document.getElementById("colour-input");
let userID = null;


/*
 Once chat is submitted, precvent default action of refreshing the page,
 emit the message to server
 clear out the message box field
 */
 socket.on('connect', function() {
    userID = socket.id;
  });


messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit("send-message", {messageInput : messageInput.value, userID} );
    messageInput.value = "";
  }
});

/*
when a chat message is received, display it as a list item.
 */

socket.on("send-message", function (data) {
  appendMessage( `${data.nameInChat} : ${data.message}` )
});

function appendMessage(data){
    var messageItem = document.createElement("li");
    messageItem.textContent = data;
    messages.prepend(messageItem);
    window.scrollTo(0, document.body.scrollHeight);
}

