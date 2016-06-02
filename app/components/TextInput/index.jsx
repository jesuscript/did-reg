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
  state$.filter(x => x).map(state => (
    <input type="text" className="form-control" value={state.value}/>
  ))
)

export default isolate(({props$, DOM}) =>({
  DOM: view(props$),
  props$: props$.filter(x => x)
    .merge(model(intent(DOM)))
    .distinctUntilChanged(p => p.value)
}))



