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

// Wait for message from parent window
addEventListener('message', receiveMessage, false);

// If message arrives from child, send back your uuid variable...
function receiveMessage(event) {
  if (event.data == 'you there brah?' && event.source !== window) {
    document.getElementsByTagName('iframe')[0].contentWindow.postMessage(uuid, '*');
    console.log('Received by: ' + page);
    console.log('Sent: ' + uuid)
  // ...but if message arrives from parent, overwrite your uuid variable with theirs
  } else if (event.source !== window) {
    uuid = event.data;
    console.log('Received: ' + uuid);
  }
}

// Send ping to parent
parent.postMessage('you there brah?', '*');
console.log('Sent from: ' + page);
