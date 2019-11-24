require('./index.css')

const { getPosts } = require('./api')
const { renderPosts, renderStatus } = require('./ui')
const { combineLatest, timer, fromEvent, EMPTY } = require('rxjs');
const { switchMap, map, tap, startWith, share, retry, retryWhen, delay, catchError } = require('rxjs/operators');


const posts$ = timer(0, 5000).pipe(
  switchMap(() => getPosts()),
  tap(posts => console.log('Posts: ', posts)),
  tap({
    error: err => console.log('ERROR!', err)
  }),
  // catchError(error => { renderStatus(error); return EMPTY}),
  retryWhen(error$ => error$.pipe(
    tap(() => console.log('Before delay')),
    delay(1000)),
    tap(() => console.log('After delay')),
  ),
  share(),
);

const filter$ = fromEvent(document.getElementById('filter'), 'input').pipe(
  map(event => event.target.value),
  startWith(''),
  tap(filter => console.log('Filter: ', filter))
);

const filteredPosts$ = combineLatest(posts$, filter$).pipe(
  map(([posts, filter]) => filterPosts(posts, filter))
)

const status$ = posts$.pipe(
  switchMap((posts) => timer(0, 1000).pipe(
    map(time => `Fetched ${posts.length} posts ${time}s ago.`)
  ))
);

filteredPosts$.subscribe(renderPosts)
status$.subscribe(renderStatus)


const filterPosts = (posts,filter) => (
  posts.filter(post => post.title.toLowerCase().includes(filter.toLowerCase()))
);