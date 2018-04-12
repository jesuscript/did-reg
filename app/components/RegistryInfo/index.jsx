import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'
import numeral from 'numeral'
import constants from "../../constants"
import {extend} from "lodash"

const makeOptions = (state) => state.accounts.map(acc => (
  <option value={acc.address} selected={acc.address === state.selectedAccount}>{acc.address} &#926; {numeral(acc.balanceEth).format("0,0.[000000]")}</option>
))

const view = (state$) => (
  Observable.merge(
    state$.filter(s => s.idStatus === constants.ID_STATUS_TAKEN)
      .map((s) => (
        <div className="col-md-12">
          <p>Primary: {s.entry.primary}</p>
          <p>Registered {s.entry.blocksAgo || 0} blocks ago</p>
        </div>
      )),
    state$.filter(s => s.idStatus === constants.ID_STATUS_FREE)
      .map(makeOptions)
      .map((accountsV) => (
        <div className="col-md-12">
          <div className="row">
            <label className="col-sm-2 control-label">Account</label>
            <div className="col-sm-10">
              <select className="form-control">
                {accountsV}
              </select>
            </div>
          </div>
        </div>
      )),
    state$.filter(s => s.idStatus === constants.ID_STATUS_UNKNOWN)
      .map(() => "")
  ).map(vtree => (
    <div className="row">
      {vtree}
    </div>
  ))
)

const intent = (DOM) => ({
  selectAccount$: DOM.select("select").events("change")
    .map(ev => $("option:selected",ev.currentTarget).val())
})

const model = (actions, props$,web3) => {
  return props$.combineLatest(
    Observable.merge(
      props$.map(p => p.accounts[0].address).first(),
      actions.selectAccount$
    ),
    ({idStatus, accounts, entry}, selectedAccount) => ({
      idStatus,
      accounts: accounts.map(acc => ({
        balanceEth: web3.fromWei(acc.balance,"ether").toNumber(),
        address: acc.address
      })),
      entry,
      selectedAccount
    })
  )
}


export default isolate(({props$, DOM, web3}) => {
  const state$ = model(intent(DOM), props$, web3)
  
  return {
    DOM: view(state$,web3),
    account$: state$.map(s => s.selectedAccount)
  }
})



