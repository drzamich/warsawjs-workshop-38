const { timer } = require("rxjs");
const { map, filter } = require('rxjs/operators')
const numbers$ = timer(0, 1000).pipe(map(() => Math.round(Math.random() * 50)))

numbers$.pipe(
  filter(x => x >10),
  map(x => x.toString()[1])
).subscribe(console.log)
