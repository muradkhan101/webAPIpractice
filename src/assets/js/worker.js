// use importScripts(script) to import globals for worker to use

onconnect = (e) => {
  let port = e.ports[0];

  port.onmessage = (msg) => {
    // Do something with data in msg.data
    port.postMessage(msg.data.join(','))
  }
}

onmessage = (e) => {
  postMessage(msg.data.join(','))
}
