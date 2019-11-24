const { timer, pipe } = require('rxjs')
const { scan, pairwise } = require('rxjs/operators')

const price$ = timer(0, 1000).pipe(
  scan((acc) => Math.round(acc + Math.random() * 60 - 30), 150),
)

const priceChanges$ = price$.pipe(
  pairwise(),
  scan((acc, cur) => {
    const difference = Math.abs(cur[1]-cur[0])
    return acc + difference
  }, 0)
)
priceChanges$.subscribe(console.log)
