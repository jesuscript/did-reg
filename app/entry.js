import "./less/main.less"
import "./index.html"
import Cycle from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {Observable} from 'rx'

import {makeWeb3Driver} from "./drivers/web3"
import main from "./components/registryUI"
import config from "./config.json"
import registryContracts from "./contracts/registryContracts.json"

Cycle.run(main, {
  DOM: makeDOMDriver('#root'),
  props$: () => Observable.of({
    searchQuery: "huy"
  }),
  web3: makeWeb3Driver(config.rpcAddr)
});
