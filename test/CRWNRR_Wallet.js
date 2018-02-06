import regeneratorRuntime from "regenerator-runtime";
var CRWNRR_Wallet = artifacts.require('./contracts/CRWNRR_Wallet.sol');

contract('CRWNRR_Wallet_Test', function (accounts) {
  let wallet;
  let creator = accounts[0];

  beforeEach(async function () {
    wallet = await CRWNRR_Wallet.new(1000, {from: creator});
  });

  it('should check if the owner lives', async function () {
    let ownerLives = await wallet.sendTo(accounts[1], 50).watch();
    assert.equal(ownerLives, true);
  });

  //Needd to watch smart contract "Events"...

});
