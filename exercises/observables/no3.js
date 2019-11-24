const { Observable } = require('rxjs');

const promiseToObservable = (promise) => (
  new Observable(observer => {
    promise
      .then(res => observer.next(res))
      .catch((err) => observer.error(err))
      .finally(() => observer.complete());
  })
);

const goodPromise = new Promise((res,rej) => {
  setTimeout(() => res('I am good promise'), 1000);
})

const badPromise = new Promise((res,rej) => {
  setTimeout(() => rej('I am bad promise'), 500);
})

goodObservable = promiseToObservable(goodPromise);
badObservable = promiseToObservable(badPromise);

const callbacks = {
  next(x) {console.log(x);},
  error(err) {console.error('error', err);},
  complete() {console.log('done');}
};

goodObservable.subscribe(callbacks);
badObservable.subscribe(callbacks);