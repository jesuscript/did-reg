import "./less/main.less"
import "./index.html"
import Cycle from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {Observable} from 'rx'

import {makeWeb3Driver} from "./drivers/web3"
import main from "./components/RegistryUI"
import config from "./config.json"
import registryContracts from "./contracts/registryContracts.json"

Cycle.run(main, {
  DOM: makeDOMDriver('#root'),
  web3: makeWeb3Driver(config.rpcAddr),
  props$: (state$) => state$.startWith({query: "", counter: 0})
});
