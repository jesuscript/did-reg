import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'

const view = (state$) => (
  state$.map(s => s.visible ? (
    <div className="row">
      <div className="col-md-12">
        <div className="panel panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title">{s.title}</h3>
          </div>
          <div className="panel-body">
            {s.content}
          </div>
          <div className="panel-footer">
            <div className="row">
              <div className="col-md-12">
                <div className="btn-group btn-group-justified">
                  <a className="btn btn-danger btn-confirm">
                    Confirm
                  </a>
                  <a className="btn btn-default btn-cancel">
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : <div></div>)
)

const intent = (DOM) => ({
  confirm$: DOM.select(".btn-confirm").events("click"),
  cancel$: DOM.select(".btn-cancel").events("click")
})

export default isolate(({props$, DOM}) => {
  const actions = intent(DOM)
  
  return {
    DOM: view(props$),
    confirm$: actions.confirm$,
    cancel$: actions.cancel$
  }
})
