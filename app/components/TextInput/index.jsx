import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'

const intent = (DOM) => ({
  change$: DOM
    .events("keyup")
    .map(ev => ev.target.value)
})

const model = (actions,value$) => (
  value$.concat(actions.change$).distinctUntilChanged().map(v => ({
    input: v
  }))
)

const view = (state$) => (
  state$.map(state => (
    <input type="text" className="form-control" value={state.input}/>
  ))
)

export default isolate(({value$, DOM}) =>(
  ((state$) => ({
    DOM: view(state$),
    value$: state$.map(s => s.input)
  })
  )(model(intent(DOM), value$))
))



