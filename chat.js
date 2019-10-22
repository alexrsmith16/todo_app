// chat app

class Chat {
  constructor(name) {
    this.name = name;
    this.messages = [];
  }
  addMessage(message) {
    this.messages.push(message);
  }
}

class Message {
  constructor(text) {
    this.text = text;
    this.seen = false;
  }
  setSeen(seen) {
    this.seen = seen;
  }
  addMedia(media) {
    this.media = media;
  }
}

let chats = [];

let dummyChat = new Chat('convo');
dummyChat.addMessage(new Message('Hi!'));
dummyChat.addMessage(new Message('Are you there?'));
dummyChat.addMessage(new Message('Stop ignoring me. Plz'));
chats.push(dummyChat);

let selectedChat = chats[0];

printChats();
printSelectedChat();

function addMessage() {
  let text = document.getElementById('newMessage').value;
  let newMessage = new Message(text);
  selectedChat.addMessage(newMessage);
  printSelectedChat();
}

function printChats() {
  let html = '<div>';
  chats.forEach(chat => {
    html += `<h2>${chat.name}</h2>`;
  });
  html += '</div>';
  document.getElementById('chats').innerHTML = html;
}

function printSelectedChat() {
  let html = '<div>';
  selectedChat.messages.forEach(message => {
    html += `
    <div>
      <p>${message.text}</p>
      <input type="checkbox" ${message.seen ? 'checked' : 'unchecked'}>
    </div>
    `;
  });

  html += '</div>';

  document.getElementById('selectedChat').innerHTML = html;
}
