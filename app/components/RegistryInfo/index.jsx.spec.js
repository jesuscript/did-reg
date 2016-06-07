import RegistryInfo, {model} from "."
import {Observable} from 'rx'
import {mockDOMSource} from '@cycle/dom'
import should from "should"
import {makeWeb3Driver} from "../../drivers/web3.js"
import config from "../../config.json"

describe("RegistryInfo", function(){
  describe("model", function(){
    it.skip("gets all accounts and balances", function(done){
      var web3 = makeWeb3Driver(config.rpcAddr)()

      model(web3).subscribe(state => {
        state.accounts.should.be.ok()

        if(!state.accounts.length){
          console.warn("Need to have at least one account for this test to work")
          done()
        }else{
          console.log("Accounts:",state.accounts)
          
          let acc = state.accounts[0]

          acc.address.should.be.ok()
          acc.balanceEth.should.be.ok()

          done()
        }
      })
    })
  })
})
