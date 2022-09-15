/*
  An npm JavaScript library for front end web apps. Implements a minimal
  Bitcoin Cash wallet.
*/

/* eslint-disable no-async-promise-executor */

import BCHJS from '@psf/bch-js'

import Util from './lib/util.js'
const util = new Util()

let _this // local global for 'this'.

class BoilerplateLib {
  constructor () {
    _this = this

    _this.bchjs = new BCHJS()
    _this.util = util
  }
}

export default BoilerplateLib
