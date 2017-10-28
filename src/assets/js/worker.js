// use importScripts(script) to import globals for worker to use

onconnect = (e) => {
  let port = e.ports[0];

  port.onmessage = (msg) => {
    // Do something with data in msg.data
    port.postMessage(msg.data.join(','))
  }
}

onmessage = (msg) => {
  if (msg.data.command && msg.data.function) {
    console.log(`Doing ${msg.data.command}`)
    if (msg.data.command == 'fetch') {
      eval(msg.data.function)(...msg.data.inputs).then(data => {
        console.log(data.items)
        postMessage({
          command: msg.data.command,
          result: data.items
        })
      })
    } else
    postMessage({
      command: msg.data.command,
      result: eval(msg.data.function)(...msg.data.inputs)
    })
  }
}
