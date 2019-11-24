const { Observable } = require('rxjs');

const observableToPromise = (observable) => {
  return new Promise((resolve,reject) => {
    let arr = [];
    observable.subscribe({
      next(x) { arr.push(x) },
      error(err) { reject(err) },
      complete() { resolve(arr) }
    })
  })
};

const goodObservable$ = new Observable(observer => {
  observer.next(1);
  observer.next(12);
  observer.next(10);
  observer.complete()
});

const badObservable$ = new Observable(observer => {
  observer.error('ERROR!!!!1');
});

const goodPromise = observableToPromise(goodObservable$);
const badPromise = observableToPromise(badObservable$);

goodPromise.then(res => console.log('Result of good promise: ', res));
badPromise.catch(err => console.log('Error of good promise: ', err));