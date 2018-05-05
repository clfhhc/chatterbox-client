// YOUR CODE HERE:
var app = {};

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
app.data=[];
app.rooms={};
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
    if (!hasEvents) {
      $('#send').on('submit','.submit',function(){
      $('#message').val().length>0 && app.handleSubmit();
      //console.log('hi');
    });
    }
    
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

app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    //data: ,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message fetched');
      console.log(data.results);
      app.data.push(...data.results);
      for (var i = 0; i < data.results.length; i++) {
        console.log(data.results[i].updatedAt);
        if (data.results[i].hasOwnProperty('roomname')) {
          if (app.rooms.hasOwnProperty(data.results[i].roomname)) {
            app.rooms[data.results[i].roomname].push(data.results[i]);
          } else {
            app.rooms[data.results[i].roomname]= [data.results[i]];
          }
        }
      }
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
  node.innerHTML = JSON.stringify(message.text);
  $('#chats').append(node);
  var node2 = document.createElement('div');
  node2.className = 'username';
  $('#main').append(node2);
};

app.renderRoom=function(roomString){
  var node = document.createElement('div');
  node.innerHTML = JSON.stringify(roomString).slice(1,-1);
  $('#roomSelect').append(node);
}
app.handleUsernameClick=function(){
  
};

app.handleSubmit=function(){
  console.log('hi');
};