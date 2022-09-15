/*
  Integration tests for the util.js utility library.
*/

// npm libraries
import chai from 'chai'

// Unit under test
import UtilLib from '../../lib/util.js'

// Locally global variables.
const assert = chai.assert
const uut = new UtilLib()

describe('#util.js', () => {
  describe('#getBchData', () => {
    it('should get BCH data on an address', async () => {
      const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'

      const bchData = await uut.getBchData(addr)

      // Assert that top-level properties exist.
      assert.property(bchData, 'balance')
      assert.property(bchData, 'utxos')

      // Assert essential UTXOs properties exist.
      assert.isArray(bchData.utxos)
      assert.property(bchData.utxos[0], 'tx_pos')
      assert.property(bchData.utxos[0], 'tx_hash')
      assert.property(bchData.utxos[0], 'value')
    })
  })
})
