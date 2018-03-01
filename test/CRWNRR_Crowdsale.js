require('babel-register');
require('babel-polyfill');

import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();

const Crowdsale = artifacts.require('CRWNRR_Crowdsale');
const SimpleToken = artifacts.require('CRWNRR_Token');
const SimpleWallet = artifacts.require('SimpleSavingsWallet');

// contract('CRWNRR_Crowdsale', function ([_, investor, wallet, purchaser]) {
contract('CRWNRR_Crowdsale', function (accounts) {
  var investor = accounts[0];
  var wallet = accounts[1];
  var purchaser = accounts[2];
  const rate = new web3.BigNumber(1);
  const value = web3.toWei(42, 'ether');
  const tokenSupply = new web3.BigNumber('1e22');
  const expectedTokenAmount = rate.mul(value);
  let balance;
  const initialRate = new web3.BigNumber(9166);
  const finalRate = new web3.BigNumber(5500);
  const rateAtTime150 = new web3.BigNumber(9166);
  const rateAtTime300 = new web3.BigNumber(9165);
  const rateAtTime1500 = new web3.BigNumber(9157);
  const rateAtTime30 = new web3.BigNumber(9166);
  const rateAtTime150000 = new web3.BigNumber(8257);
  const rateAtTime450000 = new web3.BigNumber(6439);
  beforeEach(async function () {
    await advanceBlock();
    this.startTime = latestTime() + duration.weeks(1);
    this.closingTime = this.startTime + duration.weeks(1);
    this.afterClosingTime = this.closingTime + duration.seconds(1);
    this.wallet = await SimpleWallet.new();
    this.token = await SimpleToken.new();

    this.crowdsale = await CRWNRR_Crowdsale.new(this.startTime, this.closingTime, wallet, this.token, initialRate, finalRate);
    // await this.token.transfer(this.crowdsale.address, tokenSupply);
  });

  describe('Crowdsale: accepting payments', function () {
    it('should accept payments', async function () {
      // await this.crowdsale.send(value).should.be.fulfilled;
      await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
    });
  });

  // describe('Crowdsale: high-level purchase', function () {
  //   it('should log purchase', async function () {
  //     const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
  //     const event = logs.find(e => e.event === 'TokenPurchase');
  //     should.exist(event);
  //     event.args.purchaser.should.equal(investor);
  //     event.args.beneficiary.should.equal(investor);
  //     event.args.value.should.be.bignumber.equal(value);
  //     event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it('should assign tokens to sender', async function () {
  //     await this.crowdsale.sendTransaction({ value: value, from: investor });
  //     let balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it('should forward funds to wallet', async function () {
  //     const pre = web3.eth.getBalance(wallet);
  //     await this.crowdsale.sendTransaction({ value, from: investor });
  //     const post = web3.eth.getBalance(wallet);
  //     post.minus(pre).should.be.bignumber.equal(value);
  //   });
  // });

  // describe('Crowdsale: low-level purchase', function () {
  //   it('should log purchase', async function () {
  //     const { logs } = await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
  //     const event = logs.find(e => e.event === 'TokenPurchase');
  //     should.exist(event);
  //     event.args.purchaser.should.equal(purchaser);
  //     event.args.beneficiary.should.equal(investor);
  //     event.args.value.should.be.bignumber.equal(value);
  //     event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it('should assign tokens to beneficiary', async function () {
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     const balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(expectedTokenAmount);
  //   });
  //
  //   it('should forward funds to wallet', async function () {
  //     const pre = web3.eth.getBalance(wallet);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     const post = web3.eth.getBalance(wallet);
  //     post.minus(pre).should.be.bignumber.equal(value);
  //   });
  // });
  //
  // describe('IncreasingPriceCrowdsale: rate during crowdsale should change at a fixed step every block', async function () {
  //
  //   it('at start', async function () {
  //     await increaseTimeTo(this.startTime);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(initialRate));
  //   });
  //
  //   it('at time 150', async function () {
  //     await increaseTimeTo(this.startTime + 150);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(rateAtTime150));
  //   });
  //
  //   it('at time 300', async function () {
  //     await increaseTimeTo(this.startTime + 300);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(rateAtTime300));
  //   });
  //
  //   it('at time 1500', async function () {
  //     await increaseTimeTo(this.startTime + 1500);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(rateAtTime1500));
  //   });
  //
  //   it('at time 30', async function () {
  //     await increaseTimeTo(this.startTime + 30);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(rateAtTime30));
  //   });
  //
  //   it('at time 150000', async function () {
  //     await increaseTimeTo(this.startTime + 150000);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(rateAtTime150000));
  //   });
  //
  //   it('at time 450000', async function () {
  //     await increaseTimeTo(this.startTime + 450000);
  //     await this.crowdsale.buyTokens(investor, { value, from: purchaser });
  //     balance = await this.token.balanceOf(investor);
  //     balance.should.be.bignumber.equal(value.mul(rateAtTime450000));
  //   });
  // });
  //
  // it('FinalizableCrowdsale: cannot be finalized before ending', async function () {
  //   await this.crowdsale.finalize({ from: owner }).should.be.rejectedWith(EVMRevert);
  // });
  //
  // it('FinalizableCrowdsale: cannot be finalized by third party after ending', async function () {
  //   await increaseTimeTo(this.afterClosingTime);
  //   await this.crowdsale.finalize({ from: thirdparty }).should.be.rejectedWith(EVMRevert);
  // });
  //
  // it('FinalizableCrowdsale: can be finalized by owner after ending', async function () {
  //   await increaseTimeTo(this.afterClosingTime);
  //   await this.crowdsale.finalize({ from: owner }).should.be.fulfilled;
  // });
  //
  // it('FinalizableCrowdsale: cannot be finalized twice', async function () {
  //   await increaseTimeTo(this.afterClosingTime);
  //   await this.crowdsale.finalize({ from: owner });
  //   await this.crowdsale.finalize({ from: owner }).should.be.rejectedWith(EVMRevert);
  // });
  //
  // it('FinalizableCrowdsale: logs finalized', async function () {
  //   await increaseTimeTo(this.afterClosingTime);
  //   const { logs } = await this.crowdsale.finalize({ from: owner });
  //   const event = logs.find(e => e.event === 'Finalized');
  //   should.exist(event);
  // });
  //
  // it('TimedCrowdsale: should be ended only after end', async function () {
  //   let ended = await this.crowdsale.hasClosed();
  //   ended.should.equal(false);
  //   await increaseTimeTo(this.afterClosingTime);
  //   ended = await this.crowdsale.hasClosed();
  //   ended.should.equal(true);
  // });
  //
  // describe('TimedCrowdsale: accepting payments', function () {
  //   it('should reject payments before start', async function () {
  //     await this.crowdsale.send(value).should.be.rejectedWith(EVMRevert);
  //     await this.crowdsale.buyTokens(investor, { from: purchaser, value: value }).should.be.rejectedWith(EVMRevert);
  //   });
  //
  //   it('should accept payments after start', async function () {
  //     await increaseTimeTo(this.openingTime);
  //     await this.crowdsale.send(value).should.be.fulfilled;
  //     await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
  //   });
  //
  //   it('should reject payments after end', async function () {
  //     await increaseTimeTo(this.afterClosingTime);
  //     await this.crowdsale.send(value).should.be.rejectedWith(EVMRevert);
  //     await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.rejectedWith(EVMRevert);
  //   });
  // });
});
