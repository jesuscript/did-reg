import {hJSX} from '@cycle/dom';
import {Observable} from 'rx'
import TextInput from "../TextInput"
import MorphingButton,{classes as MBClasses}  from "../MorphingButton"
import isolate from '@cycle/isolate'
import {extend} from "lodash"

const view = ({search,searchBtn},state$) => (
  Observable.combineLatest(
    search.DOM,
    searchBtn.DOM,
    state$,
    (search, searchBtn, {counter}) => (
      <div className="row vertical-align">
        <div className="col-md-12">
          <form className="form-horizontal">
            <div className="col-md-9">
              {search}
            </div>
            <div className="col-md-3">
              {searchBtn}
            </div>
          </form>
        </div>
      </div>
    ))
)

const model = ({queryChange$, searchBtnClick$},idReg) =>  Observable.merge(
  queryChange$.map(query => ({
    query
  })),
  queryChange$.filter(q => q.length).flatMap(query => {
    return idReg.registry(query)
  }).map(({registeredAddr}) => ({
    registeredAddr,
    nameAvailable: registeredAddr === "0x"
  })),
  searchBtnClick$
)


const intent = ({search,searchBtn}) => ({
  queryChange$: search.props$.map(p => p.value).share(),
  searchBtnClick$: searchBtn.props$.map(p => p.click)
})


export default isolate(({DOM,props$,idReg}) => (
  ((components) => ({
    DOM: view(components, props$),
    props$: model(intent(components), idReg)
  }))({
    search: TextInput({
      props$: props$.map(p => p.search),
      DOM
    }),
    searchBtn: MorphingButton({
      props$: props$.map(p => p.searchBtn),
      DOM
    })
  })
))
