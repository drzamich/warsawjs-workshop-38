const { Observable } = require('rxjs');

const obs$ = new Observable(observer => {
  let i = 0;
  setInterval(() => {
    observer.next(i++);
  }, 1000)
});

obs$.subscribe({
  next(x) { console.log(x)},
  complete() {console.log('done');}
});