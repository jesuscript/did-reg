import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'

const intent = (DOM) => ({
  change$: DOM.select("input[type=text]")
    .events("keyup")
    .map(ev => ev.target.value)
})

const model = (actions,value$) => (
  value$.concat(actions.change$).map(v => ({
    input: v
  })).distinctUntilChanged(x => x.input)
)

const view = (state$) => (
  state$.map(state => (
    <div className="search">
      <input type="text" value={state.input}/>
    </div>
  ))
)

export default isolate(({value$, DOM}) =>(
  ((state$) => ({
    DOM: view(state$),
    value$: state$.map(s => s.input)
  })
  )(model(intent(DOM), value$))
))



