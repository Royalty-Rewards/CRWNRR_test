var ConvertLib = artifacts.require("./ConvertLib.sol");
var CRWNRR_Token = artifacts.require("./CRWNRR_Token.sol");
var CRWNRR_SimpleMilestone = artifacts.require("./CRWNRR_SimpleMilestone.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, CRWNRR_Token);
  deployer.deploy(CRWNRR_Token);
  deployer.deploy(CRWNRR_SimpleMilestone);
};
