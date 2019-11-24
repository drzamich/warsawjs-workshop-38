const { Observable } = require('rxjs');

const arr = [1,2,3,4,5];

const obs$ = new Observable(observer => {
  arr.forEach(element => observer.next(element));
  observer.complete();
});

obs$.subscribe({
  next(x) { console.log(x)},
  complete() {console.log('done');}
});