// import regeneratorRuntime from "regenerator-runtime";
// import web3 from "web3";
// require('babel-register');
// require('babel-polyfill');
//
// const BigNumber = web3.BigNumber;
// const EVMRevert = "revert";
// let goal = 500;
//
// var DiscreteMilestone = artifacts.require('./contracts/DiscreteMilestone.sol');
//
// contract('DiscreteMilestone', function (accounts) {
//   let milestone;
//   var owner = accounts[0];
//
//   it('should check the milestone goal has been set', async function () {
//     milestone = await CRWNRR_SimpleMilestone.new();
//     await milestone.setMilestone(10);
//     let goal = await milestone.goal.call();
//     goal = goal.toNumber();
//     assert.equal(goal, 10);
//   });
//
//   it('should make sure milestone goal cannot be changed', async function () {
//     milestone = await CRWNRR_SimpleMilestone.new();
//     await milestone.setMilestone(10);
//     await milestone.setMilestone(20).catch(function(e){});
//     let goal = await milestone.goal.call();
//     goal = goal.toNumber();
//     assert.equal(goal, 10);
//   });
//
//   it('should check the milestone state is IN PROGRESS', async function () {
//     milestone = await CRWNRR_SimpleMilestone.new();
//     await milestone.setMilestone(10);
//     let stage =  await milestone.getStage.call();
//     stage = stage.toNumber();
//     assert.equal(stage, 1);
//   });
//
//   it('should make sure milestone is NOT passed', async function () {
//     milestone = await CRWNRR_SimpleMilestone.new();
//     await milestone.setMilestone(10);
//     let isMet = await milestone.checkMilestone(9);
//     let stage =  await milestone.getStage.call();
//     stage = stage.toNumber();
//     assert.equal(stage, 1);
//   });
//
//   it('should see check milestone percentage to completion', async function () {
//     milestone = await CRWNRR_SimpleMilestone.new();
//     await milestone.setMilestone(100);
//     await milestone.checkMilestone(50);
//     let percentComplete =  await milestone.getPercentageComplete.call();
//     percentComplete = stage.toNumber();
//     assert.equal(percentComplete, 50);
//   });
//
//   it('should make sure milestone IS passed', async function () {
//     milestone = await CRWNRR_SimpleMilestone.new();
//     await milestone.setMilestone(10);
//     let isMet = await milestone.checkMilestone(11);
//     assert.equal(isMet.logs[0].event, "MilestoneComplete");
//     let stage =  await milestone.getStage.call();
//     assert.equal(stage, 2);
//   });
//
// });
//
// function ether (n) {
//   return new web3.BigNumber(web3.toWei(n, 'ether'));
// }
