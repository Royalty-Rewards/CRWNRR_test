// var ConvertLib = artifacts.require("./ConvertLib.sol");
// var CRWNRR_Token = artifacts.require("./CRWNRR_Token.sol");
// var CRWNRR_SimpleMilestone = artifacts.require("./CRWNRR_SimpleMilestone.sol");
var CRWNRR_SimpleCrowdsale = artifacts.require("./CRWNRR_SimpleCrowdsale.sol");
//var CRWNRR_Crowdsale = artifacts.require("zeppelin-solidity/contracts/examples/SampleCrowdsale.sol");

module.exports = function(deployer, network, accounts){
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, CRWNRR_Token);
  // deployer.deploy(CRWNRR_Token);
  // deployer.deploy(CRWNRR_SimpleMilestone);
  // deployer.deploy(CRWNRR_Crowdsale, startTime, endTime, rate, wallet)
  // deployer.deploy(CRWNRR_Crowdsale);
  deployTestCrowdsale(deployer, accounts);
};

function deployTestCrowdsale(deployer, accounts) {

   // const accounts = web3.eth.accounts;

   const startTime = latestTime();
   const endTime = startTime + duration.days(45);
   const rate = 2500;
   const goal = web3.toWei(250, 'ether');
   const cap = web3.toWei(4000, 'ether');
   const wallet = accounts[0];

   return deployer.deploy(CRWNRR_SimpleCrowdsale, startTime, endTime, rate, goal, cap, wallet);

}

function latestTime() {
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
