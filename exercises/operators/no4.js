const { timer, pipe } = require("rxjs");
const { pairwise, startWith, scan, map, filter } = require('rxjs/operators')

const names = ['Tom', 'Bob', 'Alice', 'Peter']

let id = 0;
const posts$ = timer(0, 1000).pipe(
  startWith([]),
  scan(acc => Math.random() > 0.8 ? [...acc, {
    id: id++,
    author: names[Math.round(Math.random() * 2.9)]
  }] : acc, []),
  pairwise(),
  map(([before, after]) => {
    if(after.length !== before.length) {
      return after[after.length - 1].author;
    }
  }),
  filter(author => author !== undefined)
)

posts$.subscribe(console.log)
