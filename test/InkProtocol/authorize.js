const $ink = require("./utils")
const InkProtocolMock = artifacts.require("./mocks/InkProtocolMock.sol")

module.exports = (accounts) => {
  let token
  let user = accounts[1]
  let agent = accounts[2]

  beforeEach(async () => {
    token = await InkProtocolMock.new()
  })

  describe("#authorize()", () => {
    it("authorizes the agent", async () => {
      assert.isFalse(await token.authorizedBy(user, { from: agent }))
      assert.isTrue(await token.authorizedBy(user, { from: user }))

      await token.authorize(agent, { from: user })

      assert.isTrue(await token.authorizedBy(user, { from: agent }))
    })

    it("fails on bad agent address", async () => {
      await $ink.assertVMExceptionAsync("revert", token.authorize(0))
    })

    it("fails if agent is the sender", async () => {
      await $ink.assertVMExceptionAsync("revert", token.authorize(user, { from: user }))
    })
  })
}
