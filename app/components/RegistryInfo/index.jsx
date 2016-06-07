import {Observable} from 'rx'
import {hJSX} from '@cycle/dom';
import isolate from '@cycle/isolate'
import numeral from 'numeral'
import constants from "../../constants"
import {extend} from "lodash"

const viewFields = (state$,web3) => Observable.combineLatest(
  state$.filter(s => s.idStatus),
  state$.filter(s => s.entry),
  state$.filter(s => s.accounts).map(p => {
    return extend({},p,{
      accounts: p.accounts.map(acc => ({
        balanceEth: web3.fromWei(acc.balance,"ether").toNumber(),
        address: acc.address
      }))
    })
  }).map(state => state.accounts.map(acc => (
    <option>{acc.address}   &#926; {numeral(acc.balanceEth).format("0,0.[000000]")}</option>
  ))),
  ({idStatus}, {entry}, accountsV) => {
    if(idStatus === constants.ID_STATUS_TAKEN){
      return (
        <div className="col-md-12">
          <span>Primary: {entry.primary}</span>
          <span>Registered {entry.blocksAgo} blocks ago</span>
        </div>
      )
    }else if(idStatus === constants.ID_STATUS_FREE){
      return (
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
      )
    }else return ""
  }
)

const view = (state$, web3) => (
  viewFields(state$.startWith({
    accounts: [],
    idStatus: constants.ID_STATUS_UNKNOWN,
    entry: {}
  }), web3)
    .map(vtree => (
      <div className="row">
        {vtree}
      </div>
    ))
)

export default isolate(({props$, DOM, web3}) => {
  return {
    DOM: view(props$,web3),
    props$
  }
})



