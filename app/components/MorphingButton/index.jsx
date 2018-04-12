import {Observable} from 'rx'
import isolate from '@cycle/isolate'
import {hJSX} from '@cycle/dom';


export const classes = {
  DEFAULT: "btn btn-default",
  PRIMARY: "btn btn-primary"
}

const view = (state$) => state$.map(({className,disabled,text}) => (
  <button className={className} disabled={disabled}>{text}</button>
))
  

const intent = (DOM) => {
  return ({
    click$: DOM.events("click").do(e => e.preventDefault())
  })
} 

export default isolate(({props$,DOM}) => {
  const actions = intent(DOM)
  
  return {
    DOM: view(props$.startWith({
      className: classes.DEFAULT,
      disabled: true,
      text: ""
    })),
    click$: actions.click$
  }
})
