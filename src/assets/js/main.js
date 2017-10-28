let myWorker;
// if (window.Worker) {
//   // new Worker('worker.js') for unshared worker
//   myWorker = new SharedWorker('src/assets/js/worker.js');
//   myWorker.port.start();
//
//   window.addEventListener('click', (e) => {
//     myWorker.port.postMessage([1,2,3,4,5])
//   })
//
//   myWorker.port.onmessage = (msg) => {
//     console.log(msg);
//   }
// }

if (window.Worker) {
  myWorker = new Worker('src/assets/js/worker.js');

  myWorker.onmessage = (msg) => {
    if (msg.data.result) {
      console.log(`Result from ${msg.data.command} is ${msg.data.result}`)
    }
  }

  window.addEventListener('click', (e) => {
    console.log('clickeroni jabroni')
    // myWorker.postMessage([1,2,3,4,5])
  })

}

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('webw').addEventListener('click', () => {
    myWorker.postMessage({
      command: 'loop',
      // Passing function straight up fails since the messages are serialized and then deserialized on the other end
      function: '(function() {for (var i = 0, j = 0; i < 10000000000; i++) {j++} return j})',
      inputs : []
    })
  })

  // Performs fetch using the Web Worker
  // document.getElementById('webw').addEventListener('click', () => {
  //   myWorker.postMessage({
  //     command: 'fetch',
  //     function: '(function(url){return fetch(url).then(res => res.json())})',
  //     inputs: ['https://www.googleapis.com/books/v1/volumes?q=mystery']
  //   })
  // })

  document.getElementById('slow').addEventListener('click', () => {
    for (var i = 0, j = 9; i < 10000000000; i++) {j++}
    console.log(`Result from blocking loop is ${j}`)
  })
})
