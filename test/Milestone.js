import regeneratorRuntime from "regenerator-runtime";
import web3 from "web3";
require('babel-register');
require('babel-polyfill');

const BigNumber = web3.BigNumber;
const EVMRevert = "revert";
let goal = 500;
const INACTIVE = 0;
const INPROGRESS = 1;
const VERIFICATION = 2;
const COMPLETE = 3;

var Milestone = artifacts.require('./contracts/Milestone.sol');

contract('Milestone', function (accounts) {
  let milestone;
  var owner = accounts[0];
  var shareholders = [accounts[1],accounts[2],accounts[3],accounts[4]];
  it('should create, amd check discrete milestone', async function () {
    milestone = await Milestone.new("discreteMilestoneTest");
    await milestone.setDiscreteMilestone(10);
    let goal = await milestone.goal.call();
    goal = goal.toNumber();
    assert.equal(goal, 10);
    let stage =  await milestone.getStage.call();
    stage = stage.toNumber();
    assert.equal(stage, 0);
    let started =  await milestone.startProgress();
    let isMet = await milestone.checkMilestone(9);
    stage =  await milestone.getStage.call();
    stage = stage.toNumber();
    assert.equal(stage, 1);
    isMet = await milestone.checkMilestone(11);
    assert.equal(isMet.logs[0].event, "MilestoneComplete");
  });

  it('should check the number of shareholders, total shares, and shareholder voting weight',
  async function () {
    milestone = await Milestone.new("consensusMilestoneTest");
    //set milestone as consensus milestone (voting required to pass)
    await milestone.setConsensusMilestone(shareholders);
    let stage =  await milestone.getStage.call();
    stage = stage.toNumber();
    assert.equal(stage, INACTIVE);

    let numShareholders =  await milestone.getNumberOfShareholders.call();
    numShareholders = numShareholders.toNumber();
    assert.equal(numShareholders, 4);

    let totalShares =  await milestone.getTotalShares.call();
    assert.equal(totalShares, 4000000000000000000000000);
    let individualShares =  await milestone.getNumberOfSharesBelongingTo.call(accounts[1]);
    individualShares = individualShares.toNumber();
    totalShares = totalShares.toNumber();
    let weight = individualShares / totalShares;
    assert.equal(weight, 0.25);

    let started =  await milestone.startProgress();
    let isInProgress =  await milestone.getStage.call();
    isInProgress = isInProgress.toNumber();
    assert.equal(isInProgress, INPROGRESS);

    let verifiable =  await milestone.beginVerification();
    let isVerifiable =  await milestone.getStage.call();
    isVerifiable = isVerifiable.toNumber();
    assert.equal(isVerifiable, VERIFICATION);

    let voted =  await milestone.vote(accounts[1], true);
    let voted2 =  await milestone.vote(accounts[2], true);
    assert.equal(voted.logs[0].event, "Voted");
    assert.equal(voted2.logs[0].event, "Voted");
    let totalYesVotes =  await milestone.getTotalVotes.call(true);
    totalYesVotes = totalYesVotes.toNumber();
    let yesWeight = totalYesVotes / totalShares;
    assert.equal(yesWeight, 0.5);

    let voted3 =  await milestone.vote(accounts[3], true);
    assert.equal(voted3.logs[0].event, "Voted");
    assert.equal(voted3.logs[1].event, "MilestoneComplete");
  });

});
