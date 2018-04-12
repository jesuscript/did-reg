import {hJSX} from '@cycle/dom';
import {makeDOMDriver} from '@cycle/dom'
import Cycle from '@cycle/core'
import {Observable,ReplaySubject,Subject} from 'rx'
import TextInput from "../TextInput"
import MorphingButton,{classes as MBClasses}  from "../MorphingButton"
import RegistryInfo from "../RegistryInfo"
import ConfirmationDialog from "../ConfirmationDialog"
import isolate from '@cycle/isolate'
import {extend} from "lodash"
import constants from "../../constants"
import numeral from 'numeral'
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

const confirmationDialogContent = (toRegister, fee, web3) => (
  <div>
    <p>
      ID: {toRegister.id}
    </p>
    <p>
      Account: {toRegister.account}
    </p>
    <p>
      Fee: {numeral(web3.fromWei(fee, "ether").toNumber()).format("0,0.[000000]")} ether
    </p>
  </div>
)

const idStatus = (query, registeredAddr) => {
  if(!query) return constants.ID_STATUS_UNKNOWN

  return registeredAddr ? constants.ID_STATUS_TAKEN : constants.ID_STATUS_FREE
}

const toRegister = (actions,idStatus$) => (
  actions.initRegistration$
    .withLatestFrom(
      actions.queryChange$,
      idStatus$,
      actions.accountSelect$,
      (init,id,status,account) => (
        (init && (status == constants.ID_STATUS_FREE)) && {
          id,
          account
        }
      )
    ).startWith(false)
)

const commitRegistration = (actions,toRegister$,fee$,idReg,web3) => (
  actions.commitRegistration$.withLatestFrom(
    toRegister$,
    fee$,
    (commit, toRegister, fee) => {
      if(commit && toRegister){
        return idReg.registerSelf(toRegister.id, {
          from: toRegister.account,
          gas: 3000000,
          value: fee
        }).flatMap((hash) => {
          const subj = new Subject(),
                source = Observable.interval(200)
                  .flatMap(() => web3.eth.getTransaction(hash))

          const subSubj = source.subscribe(subj)
          
          return subj.do((tx) => {
            if(tx.blockNumber) subSubj.dispose()
          })
        })
      }else{
        return Observable.of(false)
      }
    }
  ).mergeAll().startWith(false)  
)

const accounts = (web3) => web3.eth.getAccounts().flatMap(
  addresses => Observable.from(addresses)
    .flatMap(address => web3.eth.getBalance(address).map(balance => ({
      balance,
      address
    })))
    .reduce((acc,x) => acc.concat(x), [])
)  



const getErrorMsg = (parsedTxHash) => {
  if(parsedTxHash === 0) return "Transaction failed"
}

const model = (actions,idReg,web3) => {
  const idOwner$ = actions.queryChange$.flatMap(
    q => (q ? idReg.getRegistryPrimary(q) : Observable.of("0x"))
  ).map(addr => !!parseInt(addr,16) && addr).share()

  const idStatus$ = idOwner$.withLatestFrom(
    actions.queryChange$,
    (addr,query) => idStatus(query, addr)
  )

  const fee$ = idReg.fee().share(),
        toRegister$ = toRegister(actions, idStatus$).share(),
        commitRegistration$ = commitRegistration(actions,
                                                 toRegister$.scan((x,y)=> x),
                                                 fee$,
                                                 idReg,
                                                 web3)
  
  return Observable.combineLatest(
    idStatus$.startWith(constants.ID_STATUS_UNKNOWN),
    toRegister$,
    accounts(web3),
    fee$,
    commitRegistration$,
    idOwner$,
    (idStatus,toRegister,accounts, fee, registerTxHash, idOwnerAddr) => {
      const parsedTxHash = registerTxHash && parseInt(registerTxHash,16)
      
      return {
        idStatus,
        toRegister,
        accounts,
        fee,
        registerTxHash: (parsedTxHash!==0) && registerTxHash,
        error: getErrorMsg(parsedTxHash),
        entry: idOwnerAddr && {
          primary: idOwnerAddr
        }
      }
    }
  ).do(x => console.log("registryUI state", x))
}


const intent = ({search,searchBtn, registryInfo, confirmationDialog}) => ({
  queryChange$: search.props$.map(p => p.value),
  initRegistration$: Observable.merge(
    searchBtn.click$.map(() => true),
    confirmationDialog.cancel$.map(() => false),
    confirmationDialog.confirm$.map(() => false)
  ),
  commitRegistration$: confirmationDialog.confirm$.map(() => true),
  accountSelect$: registryInfo.account$
})


export default isolate(({DOM,idReg,web3}) => {
  const state$ = new ReplaySubject(1),
        search = TextInput({
          props$: Observable.of({
            placeholder: "ID Name",
            value: "asdf"
          }),
          DOM
        }),
        searchBtn = MorphingButton({
          props$: state$.map(s => ({
            text: "Register",
            className: MBClasses.PRIMARY + " btn-block",
            disabled: (s.idStatus != constants.ID_STATUS_FREE)
          })),
          DOM
        }),
        registryInfo = RegistryInfo({
          props$: state$.map(s => ({
            accounts: s.accounts,
            idStatus: s.idStatus,
            entry: s.entry
          })),
          DOM,
          web3
        }),
        confirmationDialog = ConfirmationDialog({
          props$: state$.map(s => ({
            visible: !!s.toRegister,
            title: "You are registering a new ID",
            content: s.toRegister && confirmationDialogContent(s.toRegister, s.fee, web3)
          })).startWith({visible: false}),
          DOM
        })

  model(intent({
    search,
    searchBtn,
    registryInfo,
    confirmationDialog
  }),idReg,web3).subscribe(state$)

  return {
    DOM: view({search, searchBtn, registryInfo, confirmationDialog}, state$)
  }
})

