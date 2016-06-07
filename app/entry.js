import Cycle from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {Observable} from 'rx'
import "bootstrap/less/bootstrap.less"
import "bootstrap"

import "./css/paper.bootstrap.min.css"

import "./less/main.less"
import "./sass/main.scss" //cuz why not have both.
import "./index.html"
import {makeContractDriver,makeWeb3Driver} from "./drivers/web3"
import main from "./components/RegistryUI"
import config from "./config.json"
import registryContracts from "./contracts/registryContracts.json"

Cycle.run(main, {
  DOM: makeDOMDriver('#root'),
  web3: makeWeb3Driver(config.rpcAddr),
  idReg: makeContractDriver(config.rpcAddr,registryContracts.IdReg),
  props$: (state$) => state$.startWith({
  })
});
