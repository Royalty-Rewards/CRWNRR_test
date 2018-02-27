import regeneratorRuntime from "regenerator-runtime";
import web3 from "web3";
require('babel-register');
require('babel-polyfill');

const BigNumber = web3.BigNumber;
const EVMRevert = "revert";
let goal = 500;

var Milestone = artifacts.require('./contracts/Milestone.sol');

contract('Milestone', function (accounts) {
  let milestone;
  var owner = accounts[0];
  var shareholders = [accounts[1],accounts[2],accounts[3],accounts[4]];
  it('should check the milestone goal has been set', async function () {
    milestone = await Milestone.new();
    await milestone.setDiscreteMilestone(10);
    let goal = await milestone.goal.call();
    goal = goal.toNumber();
    assert.equal(goal, 10);
    let stage =  await milestone.getStage.call();
    stage = stage.toNumber();
    assert.equal(stage, 0);
  });

  it('should check the number of shareholders, total shares, and shareholder voting weight',
  async function () {
    milestone = await Milestone.new();
    //set milestone as consensus milestone (voting required to pass)
    await milestone.setConsensusMilestone(shareholders);
    let stage =  await milestone.getStage.call();
    stage = stage.toNumber();
    //verify that milestone state == INACTIVE
    assert.equal(stage, 0);
    let numShareholders =  await milestone.getNumberOfShareholders.call();
    numShareholders = numShareholders.toNumber();
    //verify number of shareholders
    assert.equal(numShareholders, 4);
    let totalShares =  await milestone.calculateTotalShares.call();
    totalShares = totalShares.toNumber();
    //verify total shares (sum of shareholder balances)
    assert.equal(totalShares, 4000000000000000000000000);
    let weight =  await milestone.getShareholderWeight.call(accounts[1]);
    weight = weight.toNumber();
    //verify voting weight of account[1]
    assert.equal(weight, 25);

    let started =  await milestone.startProgress();
    //check milestone state == INPROGRESS
    let isInProgress =  await milestone.getStage.call();
    isInProgress = isInProgress.toNumber();
    assert.equal(isInProgress, 1);

    let verifiable =  await milestone.beginVerification();
    let isVerifiable =  await milestone.getStage.call();
    isVerifiable = isVerifiable.toNumber();
    assert.equal(isVerifiable, 2);

    let voted =  await milestone.vote(accounts[1], true);
    let voted2 =  await milestone.vote(accounts[2], true);
    assert.equal(voted.logs[0].event, "Voted");
    assert.equal(voted2.logs[0].event, "Voted");
    let yesWeight =  await milestone.getConsensusPercentageComplete.call();
    assert.equal(yesWeight, 50);
    let voted3 =  await milestone.vote(accounts[3], true);
    assert.equal(voted3.logs[0].event, "Voted");
    assert.equal(voted3.logs[1].event, "MilestoneComplete");
  });

  // it('should make sure milestone goal cannot be changed', async function () {
  //   milestone = await Milestone.new();
  //   await milestone.setDiscreteMilestone(10);
  //   await milestone.setDiscreteMilestone(20).catch(function(e){});
  //   let goal = await milestone.goal.call();
  //   goal = goal.toNumber();
  //   assert.equal(goal, 10);
  // });
  //
  // it('should check the milestone state is IN PROGRESS', async function () {
  //   milestone = await Milestone.new();
  //   await milestone.setDiscreteMilestone(10);
  //   let stage =  await milestone.getStage.call();
  //   stage = stage.toNumber();
  //   assert.equal(stage, 1);
  // });
  //
  // it('should make sure milestone is NOT passed', async function () {
  //   milestone = await Milestone.new();
  //   await milestone.setDiscreteMilestone(10);
  //   let isMet = await milestone.checkMilestone(9);
  //   let stage =  await milestone.getStage.call();
  //   stage = stage.toNumber();
  //   assert.equal(stage, 1);
  // });
  //
  // it('should see check milestone percentage to completion', async function () {
  //   milestone = await Milestone.new();
  //   await milestone.setDiscreteMilestone(100);
  //   await milestone.checkMilestone(50);
  //   let percentComplete =  await milestone.getPercentageComplete.call();
  //   percentComplete = stage.toNumber();
  //   assert.equal(percentComplete, 50);
  // });
  //
  // it('should make sure milestone IS passed', async function () {
  //   milestone = await Milestone.new();
  //   await milestone.setDiscreteMilestone(10);
  //   let isMet = await milestone.checkMilestone(11);
  //   assert.equal(isMet.logs[0].event, "MilestoneComplete");
  //   let stage =  await milestone.getStage.call();
  //   assert.equal(stage, 2);
  // });

});

function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'));
}
