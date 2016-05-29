import {hJSX} from '@cycle/dom';
import {Observable} from 'rx'
import Search from "../search"

const view = (state$,searchDOM) => (
  state$.combineLatest(searchDOM, (state, searchVTree) => (
    <div>
      {searchVTree}
      {state.searchQuery}
    </div>
  ))
)

const model = (searchQuery$) => Observable.combineLatest(
  searchQuery$,
  (searchQuery) => ({
    searchQuery
  })
)

export default ({DOM,props$}) => (
  ((search) => ({
    DOM: view(model(search.value$), search.DOM)
  }))(Search({DOM,props$}))
)



