import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'

const view = (state$) => (
  Observable.combineLatest(
    state$.filter(p => p.hide),
    (hide) =>  (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-dismissible alert-warning">
            <button type="button" className="close" data-dismiss="alert">&times;</button>
            <h4>
              Hey
            </h4>
          </div>
        </div>
      </div>
    )
  )
)

// const model = (actions) => (

// )

// const intent = (DOM) => ({

// })



export default isolate(({props$, DOM}) => ({
  DOM: view(props$.startWith({hide: true})),
  props$ //: model(intent(DOM))
}))
