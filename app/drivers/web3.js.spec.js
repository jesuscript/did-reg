import {makeContractDriver,makeWeb3Driver} from "./web3.js"
import config from "../config.json"
import registryContracts from "../contracts/registryContracts.json"
import {Observable,Subject} from 'rx'


describe("Web3", function(){
  describe("driver", function(){
    var Web3Driver,
        web3

    before(function(){
      Web3Driver = makeWeb3Driver(config.rpcAddr)
      web3 = Web3Driver()
    })

    it("@now waits until a transaction is confirmed", function(done){//run with PoA
      web3.eth.getAccounts().flatMap(
        (accounts) => web3.eth.sendTransaction({
          to: "0xe33626683ac9478c5a67e39af87790aeda0af934",
          from: accounts[0],
          value: web3.toWei(1,"ether")
        })
      ).flatMap((hash) => {
        const subj = new Subject(),
              source = Observable.interval(200)
                .flatMap(() => web3.eth.getTransaction(hash))

        const subSubj = source.subscribe(subj)
        
        return subj.do((tx) => {
          if(tx.blockNumber) subSubj.dispose()
        })
      }).filter(tx => tx.blockNumber).subscribe((x) => {
        console.log(x)
        done()
      })
    })
  })
  
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
