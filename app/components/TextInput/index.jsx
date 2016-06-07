import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'

const intent = (DOM) => ({
  change$: DOM
    .events("keyup")
    .map(ev => ev.target.value)
    .distinctUntilChanged()
})

const model = (actions) => (
  actions.change$.map(value => ({
    value
  }))
)

const view = (state$) => (
  Observable.combineLatest(
    state$.filter(x => x.value !== undefined).map(x => x.value).startWith(""),
    state$.filter(x => x.placeholder !== undefined).map(x => x.placeholder).startWith(""),
    (value, placeholder) => (
      <input type="text" className="form-control" value={value} placeholder={placeholder}/>
    )
  )
)

export default isolate(({props$, DOM}) =>({
  DOM: view(props$),
  props$: model(intent(DOM)).merge(
    props$
  )
}))



