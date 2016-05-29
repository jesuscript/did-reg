import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'

const intent = (DOM) => ({
  change$: DOM.select("input[type=text]")
    .events("keyup")
    .map(ev => ev.target.value)
})

const model = (actions,props$) => (
  props$.map(props => props.searchQuery).first().concat(actions.change$).map(v => ({
    input: v
  }))
)

const view = (state$) => (
  state$.map(state => (
    <div className="search">
      <input type="text" value={state.input}/>
    </div>
  ))
)

export default isolate(
  ({props$, DOM}) =>((state$) => ({
    DOM: view(state$),
    value$: state$.map(s => s.input)
  }))(model(intent(DOM), props$))
)


