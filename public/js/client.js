var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var messageInput = document.getElementById('message-input');

var nickname = prompt('Please enter your nick name')

/*
 Once chat is submitted, precvent default action of refreshing the page,
 emit the message to server
 clear out the message box field
 */
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('send-message', messageInput.value);
        messageInput.value = '';
    }
});

/*
when a chat message is received, display it as a list item.
 */

socket.on('send-message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.prepend(item);
    window.scrollTo(0, document.body.scrollHeight);
});