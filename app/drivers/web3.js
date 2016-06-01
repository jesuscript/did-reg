import Web3 from "web3"
import {Observable} from 'rx'
import {reduce,isFunction,keys,extend} from "lodash"

export function makeWeb3Driver(rpcHost){
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcHost))

  return function(){
    return {
      eth: reduce(keys(web3.eth), (eth,name) => {
        //converting all eth functions into observables, ignoring getters because they suck

        if(!Object.getOwnPropertyDescriptor(web3.eth,name).get && isFunction(web3.eth[name])){
          eth[name] = function(){
            return Observable.fromNodeCallback(web3.eth[name]).apply(null, arguments)
          }
        }

        return eth
      },{})
    }
  }
}


export function makeContractDriver(rpcHost,{contractAddr,abi}){
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcHost)),
        contract = web3.eth.contract(abi).at(contractAddr)

  var rxContract = abi.filter((x) => x.type === "function")
        .map((x) => x.name)
        .reduce((newContract,fnName) => {
          newContract[fnName] = function(){
            var args = arguments
            console.log("call web3",args)
            return Observable.fromNodeCallback(contract[fnName]).apply(null, args)
          }
          
          return newContract
        }, {})

  return function(request$){
    return rxContract
  } 
}
