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

// Assign UUID to variable
var uuid = guid();
var level = 0;
var post_message = '';

// Wait for message from parent window
addEventListener('message', receiveMessage, false);

// If message arrives from child, send back your uuid variable...
function receiveMessage(event) {
  if(event.source == window) {return};
  if (JSON.parse(event.data).event == 'check_for_parent') {
    post_message = {
      'event':'send_uuid',
      'uuid':uuid,
      'level':level
    };
    document.getElementsByTagName('iframe')[0].contentWindow.postMessage(JSON.stringify(post_message), '*');
    console.log('Received by: ' + page);
    console.log('Sent: ' + uuid)
  // ...but if message arrives from parent, overwrite your uuid variable with theirs
  } else if (JSON.parse(event.data).event == 'send_uuid') {
    uuid = JSON.parse(event.data).uuid;
    level = JSON.parse(event.data).level + 1;
    console.log('Received: ' + uuid + '. I am level ' + level + '.');
  }
}

// Send ping to parent
post_message = {
  'event':'check_for_parent'
};
parent.postMessage(JSON.stringify(post_message), '*');
console.log('Sent from: ' + page);
