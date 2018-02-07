import regeneratorRuntime from "regenerator-runtime";
var CRWNRR_Wallet = artifacts.require('./contracts/CRWNRR_Wallet.sol');

contract('CRWNRR_Wallet_Test', function (accounts) {
  let wallet;
  let creator = accounts[0];
  let amountToSend = 5;
  beforeEach(async function () {
    wallet = await CRWNRR_Wallet.new(1000, {from: creator});
  });

  it('should check if the owner lives', async function () {
    let ownerLives = await wallet.sendTo(accounts[1], amountToSend).watch();
    assert.equal(ownerLives, true);
  });

  it('should return Sent event after transaction happens', async function () {
    let sent = await wallet.Sent(payee, amount, balance)
    assert.equal(amount, amountToSend);
  });
});
