import {hJSX} from '@cycle/dom';
import {Observable} from 'rx'
import TextInput from "../TextInput"
import MorphingButton,{classes as MBClasses}  from "../MorphingButton"
import RegistryInfo from "../RegistryInfo"
import ConfirmationDialog from "../ConfirmationDialog"
import isolate from '@cycle/isolate'
import {extend} from "lodash"
import constants from "../../constants"
import "./registry-ui.less"

const view = ({search,searchBtn,registryInfo, confirmationDialog}, state$) => (
  Observable.combineLatest(
    search.DOM,
    searchBtn.DOM,
    registryInfo.DOM,
    confirmationDialog.DOM,
    (search, searchBtn, registryInfo, confirmationDialog) => (
      <div className="row vertical-align registry-ui">
        <form className="col-md-12 form-horizontal">
          <div className="row search-form">
            <div className="col-md-9">
              {search}
            </div>
            <div className="col-md-3">
              {searchBtn}
            </div>
          </div>
          {confirmationDialog}
          <div className="row registry-info">
            <div className="col-md-9">
              {registryInfo}
            </div>
          </div>
        </form>
      </div>
    ))
)

const model = ({queryChange$, searchBtnClick$},idReg, web3, props$) =>  Observable.merge(
  queryChange$.filter(q => q).flatMap(query => {
    return idReg.registry(query)
  }).map((registeredAddr) => ({
    registeredAddr,
    idStatus: (registeredAddr === "0x") ? constants.ID_STATUS_FREE : constants.ID_STATUS_TAKEN
  })),
  queryChange$.filter(q => !q).map({idStatus: constants.ID_STATUS_UNKNOWN}),
  searchBtnClick$.withLatestFrom(
    props$.filter(p => p.idStatus),
    queryChange$,
    (ev, {idStatus}, query) => ({
      showConfirmationDialog: (idStatus === constants.ID_STATUS_FREE) && {
        title: "Registering " + query,
        body: "Account: ,Fee: ",
        onConfirm: () => Observable.empty().do(() => console.log("confirm!"))
      }
    })
  ).do(x => console.log(x)),
  web3.eth.getAccounts()
    .flatMap(
      addresses => Observable.from(addresses)
        .flatMap(address => web3.eth.getBalance(address).map(balance => ({
          balance,
          address
        })))
        .reduce((acc,x) => acc.concat(x), [])
    ).map(accounts => ({
      accounts
    }))
)


const intent = ({search,searchBtn}) => ({
  queryChange$: search.props$.map(p => p.value),
  searchBtnClick$: searchBtn.props$.map(p => p.click)
})


export default isolate(({DOM,props$,idReg,web3}) => (
  ((components) => ({
    DOM: view(components, props$),
    props$: model(intent(components), idReg, web3, props$)
  }))({
    search: TextInput({
      props$: Observable.of({
        placeholder: "ID Name",
        value: ""
      }),
      DOM
    }),
    searchBtn: MorphingButton({
      props$: props$.filter(p => p.idStatus).map(p => ({
        disabled: (p.idStatus != constants.ID_STATUS_FREE)
      })).startWith({
        text: "Register",
        className: MBClasses.PRIMARY + " btn-block"
      }),
      DOM
    }),
    registryInfo: RegistryInfo({
      props$,
      DOM,
      web3
    }),
    confirmationDialog: ConfirmationDialog({
      props$: props$.filter(p => p.showConfirmationDialog).map(p => p.showConfirmationDialog),
      DOM
    })
  })
))
