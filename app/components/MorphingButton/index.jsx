import isolate from '@cycle/isolate'
import {hJSX} from '@cycle/dom';


export const classes = {
  DEFAULT: "btn btn-default"
}

const getClass = (state) => (
  `btn ${state.className}`
)

const getText = (state) => (
  state.text
)

const view = (state$) => (
  state$.map(state => (
    <button className={getClass(state)}>{getText(state)}</button>
  ))
)

export const model = (actions,props$) => (
  props$.merge(actions.click$.withLatestFrom(props$, (event,props) =>({
    text: props.text,
    className: props.className,
    event
  })))
)

const intent = (DOM) => {
  return ({
    click$: DOM.events("click")
  })
} 

export default isolate(({props$,DOM}) => (
  ((state$) => ({
    DOM: view(state$),
    click$: state$.do(x => console.log(x)).filter(s => s.event).map(s => s.event)
  })
  )(model(intent(DOM),props$))
))
