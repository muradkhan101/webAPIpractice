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
//   myWorker.port.onMessage = (msg) => {
//     console.log(msg);
//   }
// }

if (window.Worker) {
  myWorker = new Worker('src/assets/js/worker.js');

  myWorker.onMessage = (msg) => {
    console.log(msg)
  }

    window.addEventListener('click', (e) => {
      console.log('clickeroni jabroni')
      myWorker.postMessage([1,2,3,4,5])
    })

}
