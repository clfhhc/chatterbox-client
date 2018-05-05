// YOUR CODE HERE:
var app = {};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
app.data=[];
app.rooms={};
app.friends={};
app.init = function(){
    let events = $._data(document.getElementById('main'), "events");
    let hasEvents = (events != null);
    if (!hasEvents) {
      $('#main').on('click','.username',function(event){
      app.handleUsernameClick(this.innerText.slice(1,-1));
      // console.log(this.innerHTML);
    });
    }
    events = $._data(document.getElementById('send'), "events");
    hasEvents = (events != null);
    if (!hasEvents) {
      $('#send').on('submit',function(event){
        event.preventDefault();
        $('#message').val().length>0 && app.handleSubmit();
      });
    }
    events = $._data(document.getElementById('roomSelect'), "events");
    hasEvents = (events != null);
    if (!hasEvents) {
      $('#roomSelect').on('change',function(event){
        app.fetch(100);
      });
    }
    app.fetch(100);
};

app.send = function(message){
  
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(limit){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    //data: ,
    contentType: 'application/json',
    data: {
      limit: limit,
      order: '-createdAt'
      
        },
    success: function (data) {
      console.log('chatterbox: Message fetched');
      app.data=data.results;
      app.clearMessages();
      app.clearUsername();
      app.rooms={};
      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].roomname) {
          if (data.results[i].username) {
            data.results[i].text = escape(data.results[i].text);
            data.results[i].username = escape(data.results[i].username);
            data.results[i].roomname = escape(data.results[i].roomname);
            if (data.results[i].hasOwnProperty('roomname')) {
              if (app.rooms.hasOwnProperty(data.results[i].roomname)) {
                app.rooms[data.results[i].roomname].push(data.results[i]);
              } else {
                app.rooms[data.results[i].roomname]= [data.results[i]];
              }
            }
          }
          
        }
        
      }
      let roomname=$('#roomSelect').val();
      app.renderRoom();
      if (app.rooms.hasOwnProperty(roomname)) {
        $('#roomSelect').val(roomname);
      };
      app.renderMessageBaseOnRoom($('#roomSelect').val());
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
}
app.clearMessages = function() {
  console.log('ok');
  $( '#chats' ).empty();
};
app.renderMessage=function(message){
  var chat = document.createElement('div');
  chat.className = 'chat';
  
  
  
  if (!app.friends.hasOwnProperty(message.username)) {
    app.friends[message.username]=false;
  }
  
  var node = document.createElement('div');
  node.innerHTML = JSON.stringify(message.username).slice(1,-1)+':';
  node.className = 'username';
  $(chat).append(node);
  // $('#chats').append(node);
  
  let node2 = document.createElement('span');
  node2.className = 'username';
  node2.innerHTML = JSON.stringify(message.username)
  $('#main .usernameList').append(node2);
  
  node = document.createElement('div');
  node.innerHTML = JSON.stringify(message.text).slice(1,-1);
  $(chat).append(node);
  // $('#chats').append(node);
  
  node = document.createElement('div');
  node.innerHTML = new Date(message.createdAt).toTimeString();
  node.className = 'time';
  $(chat).append(node);
  $('#chats').append(chat);
  $('#chats').append('<br>');
  
};

app.renderMessageBaseOnRoom=function(roomname){
  if (app.rooms.hasOwnProperty(roomname)) {
    for (let message of app.rooms[roomname]) {
      app.renderMessage(message);
    }
  }
}
app.renderRoom=function(roomString){
  $( '#roomSelect' ).empty();
  for (let room of Object.keys(app.rooms)) {
    let node = document.createElement('option');
    node.innerHTML = room;
    node.value = room;
    $('#roomSelect').append(node);
  }
  
}
app.handleUsernameClick=function(username){
  console.log(12);
  if(app.friends[username]) {
    app.friends[username] = false;
    Array.prototype.forEach.call($(`#main .username:contains('${username}')`),function(item) {
      console.log(item.classList);
      item.classList.add('friended');
    });
    // $(`#main .username:contains('${username}')`).forEach((item)=>{
    //   item.classList.remove('friended');
    // });
    Array.prototype.forEach.call($(`#chats .username:contains('${username}')`),function(item) {
      item.classList.add('friended');
    });
    // $(`#chat .username:contains('${username}')`).forEach((item)=>{
    //   item.classList.remove('friended');
    // });
  }else {
    
    app.friends[username] = true;
    Array.prototype.forEach.call($(`#main .username:contains('${username}')`),function(item){
      console.log(2);
      item.classList.remove('friended');
    });
    // $(`#main .username:contains('${username}')`).forEach((item)=>{
    //   item.classList.add('friended');
    // });
    Array.prototype.forEach.call($(`#chats :contains('${username}')`),function(item){
      item.classList.remove('friended');
    });
    // $(`#chat .username:contains('${username}')`).forEach((item)=>{
    //   item.classList.add('friended');
    // });
  }
  
    // if (app.friends[message.username]) {
      // node.classList.add('friended');
      
    // }
};

app.handleSubmit=function(){
  var message = {
    username: window.location.search.slice(window.location.search.indexOf('username=')+9),
    text: $('#message').val(),
    roomname: $('#roomSelect').val()
  }
  app.send(message);
  setTimeout(app.fetch.bind(null,100),500);
};
app.clearUsername = function() {
  console.log('ok');
  $( '#main .usernameList' ).empty();
};