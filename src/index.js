require('./index.css')

const { getPosts } = require('./api')
const { renderPosts, renderStatus } = require('./ui')
const { combineLatest, timer, fromEvent } = require('rxjs');
const { switchMap, map, tap, startWith, share } = require('rxjs/operators');

const posts$ = timer(0, 5000).pipe(
  switchMap(() => getPosts()),
  tap(posts => console.log('Posts: ', posts)),
  share(),
  tap({
    error: err => console.log('ERROR!', err)
  }),
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
  map(posts => `Fetched ${posts.length} posts.`)
);

const errorStatus$ = posts$.subscribe({
  error: err => renderStatus(err)
})

filteredPosts$.subscribe(renderPosts)
status$.subscribe(renderStatus)


const filterPosts = (posts,filter) => (
  posts.filter(post => post.title.toLowerCase().includes(filter.toLowerCase()))
);