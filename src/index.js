require('./index.css')
const { getPosts } = require('./api')
const { renderPosts, renderStatus } = require('./ui')
const { timer, fromEvent, combineLatest, Subject, of, merge } = require('rxjs')
const { switchMap, map, tap, startWith, share, retryWhen, delay } = require('rxjs/operators')

const error$ = new Subject()

const post$ = timer(0, 5000).pipe(
  switchMap(() => getPosts()),
  retryWhen(errorObs$ => errorObs$.pipe(
    tap(x => error$.next(x)),
    delay(1000),
  )),
  share(),
)

const filter$ = fromEvent(document.getElementById('filter'), 'input').pipe(
  map(event => event.target.value),
  startWith(''),
)

const filteredPosts$ = combineLatest(post$, filter$).pipe(
  map(([posts, filter]) => filterPosts(posts, filter)),
)

const fetchStatus$$ = post$.pipe(
  map(posts => timer(0,1000).pipe(
    map(time => `Fetched ${posts.length} posts in ${time}s.`),
  ))
)

const errorStatus$$ = error$.pipe(
  map(err => of(`Error! ${err}`))
)

const status$ = merge(fetchStatus$$, errorStatus$$).pipe(
  switchMap(status$$ => status$$)
)

filteredPosts$.subscribe(renderPosts)
status$.subscribe(renderStatus)
function filterPosts(posts, filter) {
  const filterLowerCase = filter.toLowerCase()
  return posts.filter(post => post.title.toLowerCase().includes(filterLowerCase))
}