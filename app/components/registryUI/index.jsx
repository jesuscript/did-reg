import {hJSX} from '@cycle/dom';
import {Observable} from 'rx'
import TextInput from "../TextInput"
import MorphingButton,{classes as MBClasses}  from "../MorphingButton"
import isolate from '@cycle/isolate'
import {extend} from "lodash"

const view = ({search,searchBtn},state$) => (
  Observable.combineLatest(
    search,
    searchBtn,
    state$,
    (search, searchBtn, {counter}) => (
      <div className="row">
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
  }))
)


const intent = ({search,searchBtn}) => ({
  queryChange$: search.value$,
  searchBtnClick$: searchBtn.click$
})


export default isolate(({DOM,props$,idReg}) => (
  (({search,searchBtn}) => (
    ((state$) => ({
      
      DOM: view({
        search: search.DOM,
        searchBtn: searchBtn.DOM
      }, props$),
      props$: state$
      
    }))(model(intent({search,searchBtn}), idReg, props$))
  ))({
    search: TextInput({
      value$: props$.first().map(p => p.query),
      DOM
    }),
    searchBtn: MorphingButton({
      props$: props$.filter(p => p.searchBtnText).map(p => ({
        text: p.searchBtnText,
        className: "btn-default btn-block"
      })),
      DOM
    })
  })
))
