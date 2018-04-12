import Web3 from "web3"
import {Observable} from 'rx'
import {reduce,isFunction,keysIn,extend} from "lodash"

export function makeWeb3Driver(rpcHost){
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcHost))
  
  return function(){
    return extend({},web3,{
      eth: reduce(keysIn(web3.eth), (eth,name) => {
        var isShittyProp = Object.getOwnPropertyDescriptor(web3.eth,name) &&
              Object.getOwnPropertyDescriptor(web3.eth,name).get

        if(!isShittyProp && isFunction(web3.eth[name])){
          eth[name] = function(){
            return Observable.fromNodeCallback(web3.eth[name]).apply(web3.eth, arguments)
          }
        }

        return eth
      },{})
    })
  }
}


export function makeContractDriver(rpcHost,{address,abi}){
  const web3 = new Web3(new Web3.providers.HttpProvider(rpcHost)),
        contract = web3.eth.contract(abi).at(address)

  var rxContract = abi.filter((x) => x.type === "function")
        .map((x) => x.name)
        .reduce((newContract,fnName) => {
          newContract[fnName] = function(){
            var args = arguments
            console.log("call web3",fnName,args)
            return Observable.fromNodeCallback(contract[fnName]).apply(null, args)
          }
          
          return newContract
        }, {})

  return function(){
    return rxContract
  } 
}
