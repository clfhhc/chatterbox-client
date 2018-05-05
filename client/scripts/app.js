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
      $('#main').on('click','.username',function(){
      app.handleUsernameClick();
    });
    }
    events = $._data(document.getElementById('send'), "events");
    hasEvents = (events != null);
    console.log(1);
    if (!hasEvents) {
      $('#send').on('submit',function(event){
      event.preventDefault();
      console.log(2);
      $('#message').val().length>0 && app.handleSubmit();
      //console.log('hi');
    });
    }
    app.fetch(50);
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
      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].roomname) {
          if (data.results[i].username) {
            if (data.results[i].hasOwnProperty('roomname')) {
              if (app.rooms.hasOwnProperty(data.results[i].roomname)) {
                app.rooms[data.results[i].roomname].push(data.results[i]);
              } else {
                app.rooms[data.results[i].roomname]= [data.results[i]];
              }
            }
            app.renderMessage(data.results[i]);
          }
          
        }
        
      }
      app.renderRoom();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
}
app.clearMessages = function() {
  $( '#chats' ).empty();
};
app.renderMessage=function(message){
  var node = document.createElement('div');
  console.log(JSON.stringify(message.username));
  node.innerHTML = JSON.stringify(message.username).slice(1,-1)+':';
  $('#chats').append(node);
  node = document.createElement('div');
  node.innerHTML = JSON.stringify(message.text).slice(1,-1);
  $('#chats').append(node);
  
  if (message.username) {
    if (!app.friends.hasOwnProperty(message.username)) {
      app.friends[message.username]=false;
      var node = document.createElement('span');
      node.className = 'username';
      node.innerHTML = JSON.stringify(message.username)
      $('#main').append(node);
    }
  }
  
  
};

app.renderRoom=function(roomString){
  $( '#roomSelect' ).empty();
  for (let room of Object.keys(app.rooms)) {
    let node = document.createElement('option');
    node.innerHTML = room;
    node.value = room;
    $('#roomSelect').append(node);
  }
  
}
app.handleUsernameClick=function(){
  
};

app.handleSubmit=function(){
  console.log('hi');
};