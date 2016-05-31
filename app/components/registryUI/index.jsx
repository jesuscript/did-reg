import {hJSX} from '@cycle/dom';
import {Observable} from 'rx'
import TextInput from "../TextInput"
import MorphingButton,{classes as MBClasses}  from "../MorphingButton"
import isolate from '@cycle/isolate'
import _ from "lodash"

const view = ({search,searchBtn},state$) => (
  Observable.combineLatest(
    search,
    searchBtn,
    state$,
    (search, searchBtn, {counter}) => (
      <div>
        {search}
        {searchBtn}
        {counter}
      </div>
    ))
)

const model = (actions) => {
  return Observable.combineLatest(
    actions.queryChange$,
    actions.counterInc$.startWith(0).scan((x,y) => x+y),
    (query,counter) => ({
      searchBtnText: query,
      counter
    })
  )
}

const intent = ({search,searchBtn}) => {
  return {
    queryChange$: search.value$,
    counterInc$: searchBtn.click$.map(ev => +1)
  }
}


export default isolate(({DOM,props$}) => {
  const search = TextInput({value$: props$.first().map(p => p.query), DOM}),
        searchBtn = MorphingButton({props$: props$.map(p => ({text: p.searchBtnText})), DOM}),
        state$ = model(intent({search,searchBtn}))

  return {
    DOM: view({
      search: search.DOM,
      searchBtn: searchBtn.DOM
    }, state$),
    props$: state$
  }
})
