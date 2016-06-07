import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import {hJSX} from '@cycle/dom';


export const classes = {
  DEFAULT: "btn btn-default",
  PRIMARY: "btn btn-primary"
}

const view = (state$) => (
  Observable.combineLatest(
    state$.filter(s => s.className),
    state$.filter(s => s.text),
    state$.filter(s => s.disabled !== undefined),
    ({className}, {text}, {disabled}) => (
      <button className={className} disabled={disabled}>{text}</button>
    )
  )
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
  DOM: view(props$.startWith({disabled: true})),
  props$: model(intent(DOM))
}))
