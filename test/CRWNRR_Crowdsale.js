require('babel-register');
require('babel-polyfill');

const BigNumber = web3.BigNumber;
const EVMRevert = "revert";

// require('chai')
//   .use(require('chai-as-promised'))
//   .use(require('chai-bignumber')(BigNumber))
//   .should();

const CRWNRR_Crowdsale = artifacts.require('CRWNRR_SimpleCrowdsale');
const CRWNRR_Token = artifacts.require('CRWNRR_Token');

contract('CRWNRR_Crowdsale', function (accounts) {
// contract('CRWNRR_Crowdsale', function (accounts) {
  const RATE = new BigNumber(10);
  const GOAL = ether(10);
  const CAP = ether(20);
  const owner = accounts[0];
  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.startTime = latestTime() + duration.weeks(1);
    this.endTime = this.startTime + duration.weeks(1);
    this.afterEndTime = this.endTime + duration.seconds(1);

    this.crowdsale = await CRWNRR_SimpleCrowdsale.new(this.startTime, this.endTime, RATE, GOAL, CAP, accounts[0]);
    this.token = CRWNRR_Token.at(await this.crowdsale.token());

    // this.token = await CRWNRR_Token.new();
    // this.crowdsale = await CRWNRR_Crowdsale.new(this.startTime, this.endTime, RATE, GOAL, CAP, this.token.address);
    // await this.token.transferOwnership(this.crowdsale.address);
  });

  // it('should create crowdsale with correct parameters', async function () {
  //   this.crowdsale.should.exist;
  //   this.token.should.exist;
  //
  //   // const startTime = await this.crowdsale.startTime();
  //   // const endTime = await this.crowdsale.endTime();
  //   // const rate = await this.crowdsale.rate();
  //   // const walletAddress = await this.crowdsale.wallet();
  //   // const goal = await this.crowdsale.goal();
  //   // const cap = await this.crowdsale.cap();
  //
  //   startTime.should.be.bignumber.equal(this.startTime);
  //   endTime.should.be.bignumber.equal(this.endTime);
  //   rate.should.be.bignumber.equal(RATE);
  //   walletAddress.should.be.equal(this.token.address);
  //   goal.should.be.bignumber.equal(GOAL);
  //   cap.should.be.bignumber.equal(CAP);
  // });
  //
  // it('should not accept payments before start', async function () {
  //   await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
  //   await this.crowdsale.buyTokens(investor, { from: investor, value: ether(1) }).should.be.rejectedWith(EVMRevert);
  // });
  //
  // it('should accept payments during the sale', async function () {
  //   const investmentAmount = ether(1);
  //   const expectedTokenAmount = RATE.mul(investmentAmount);
  //
  //   await increaseTimeTo(this.startTime);
  //   await this.crowdsale.buyTokens(investor, { value: investmentAmount, from: investor }).should.be.fulfilled;
  //
  //   (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
  //   (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
  // });
  //
  // it('should reject payments after end', async function () {
  //   await increaseTimeTo(this.afterEnd);
  //   await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
  //   await this.crowdsale.buyTokens(investor, { value: ether(1), from: investor }).should.be.rejectedWith(EVMRevert);
  // });
  //
  // it('should reject payments over cap', async function () {
  //   await increaseTimeTo(this.startTime);
  //   await this.crowdsale.send(CAP);
  //   await this.crowdsale.send(1).should.be.rejectedWith(EVMRevert);
  // });
  //
  // it('should allow finalization and transfer funds to wallet if the goal is reached', async function () {
  //   await increaseTimeTo(this.startTime);
  //   await this.crowdsale.send(GOAL);
  //
  //   const beforeFinalization = web3.eth.getBalance(wallet);
  //   await increaseTimeTo(this.afterEndTime);
  //   await this.crowdsale.finalize({ from: owner });
  //   const afterFinalization = web3.eth.getBalance(wallet);
  //
  //   afterFinalization.minus(beforeFinalization).should.be.bignumber.equal(GOAL);
  // });
  //
  // it('should allow refunds if the goal is not reached', async function () {
  //   const balanceBeforeInvestment = web3.eth.getBalance(investor);
  //
  //   await increaseTimeTo(this.startTime);
  //   await this.crowdsale.sendTransaction({ value: ether(1), from: investor, gasPrice: 0 });
  //   await increaseTimeTo(this.afterEndTime);
  //
  //   await this.crowdsale.finalize({ from: owner });
  //   await this.crowdsale.claimRefund({ from: investor, gasPrice: 0 }).should.be.fulfilled;
  //
  //   const balanceAfterRefund = web3.eth.getBalance(investor);
  //   balanceBeforeInvestment.should.be.bignumber.equal(balanceAfterRefund);
  // });
});

function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'));
}

function advanceBlock () {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now(),
    }, (err, res) => {
      return err ? reject(err) : resolve(res);
    });
  });
}

function increaseTime (duration) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1);

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id + 1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

function latestTime () {
  return web3.eth.getBlock('latest').timestamp;
}

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};
