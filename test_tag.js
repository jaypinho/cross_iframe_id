// Generate UUID
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

// Request UUID from parent recursively until it reaches the top-level window
function getUuidFromParent() {
  if(self==top) {return;}
  var separation = 1;
  var current_iteration = window;
  do {
    post_message = {
      'event':'check_for_parent',
      'separation':separation
    };
    current_iteration.parent.postMessage(JSON.stringify(post_message), '*');
    console.log('Sent UUID request from: ' + page);
    current_iteration = current_iteration.parent;
    level++;
    separation++;
  }
  while (current_iteration != top);
  console.log('I am level ' + level + '.');
}

// Initialize variables
var uuid = guid();
var level = 1;
var post_message = '';

// Wait for message from parent window
addEventListener('message', receiveMessage, false);

// If message arrives from child, send back your uuid variable...
function receiveMessage(event) {
  if(event.source == window) {return;}
  if (JSON.parse(event.data).event == 'check_for_parent') {
    post_message = {
      'event':'send_uuid',
      'uuid':uuid,
      'level':level,
      'separation':JSON.parse(event.data).separation
    };
    event.source.postMessage(JSON.stringify(post_message), '*');
    console.log('UUID request received by: ' + page);
    console.log('UUID response sent by ' + page + ': ' + uuid)
  // ...but if message arrives from parent, overwrite your uuid variable with theirs
  } else if (JSON.parse(event.data).event == 'send_uuid') {
    uuid = JSON.parse(event.data).uuid;
    level = JSON.parse(event.data).level + JSON.parse(event.data).separation;
    console.log('UUID response received by ' + page + ': ' + uuid + '. I am level ' + level + '.');
  }
}

getUuidFromParent();
