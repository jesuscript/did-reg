import {makeContractDriver,makeWeb3Driver} from "./web3.js"
import config from "../config.json"
import registryContracts from "../contracts/registryContracts.json"
import {Observable} from 'rx'


describe("Web3", function(){
  describe("contract driver", function(){
    var idReg
    
    before(function(){
      idReg = makeContractDriver(config.rpcAddr,registryContracts.IdReg)
    })

    it("can make calls", function(done){
      const reg = idReg()

      const call$ = reg.registry("abc")

      call$.subscribe(p => {
        call$.subscribe(p => {
          done()
        })
      })
    })
  })
})
