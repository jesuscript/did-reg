import isolate from '@cycle/isolate'
import {hJSX} from '@cycle/dom';


export const classes = {
  DEFAULT: "btn btn-default"
}

const getClass = (state) => (
  `btn ${state.className || ""}`
)

const getText = (state) => (
  state.text
)

const view = (state$) => (
  state$.map(state => (
    <button className={getClass(state)}>{getText(state)}</button>
  ))
)

export const model = (actions) => (
  actions.click$.map((event) =>({
    click: event
  }))
)

const intent = (DOM) => {
  return ({
    click$: DOM.events("click").do(e => e.preventDefault())
  })
} 

export default isolate(({props$,DOM}) => ({
  DOM: view(props$.filter(x => x)),
  props$: model(intent(DOM))
}))
