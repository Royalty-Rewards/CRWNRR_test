var ConvertLib = artifacts.require("./ConvertLib.sol");
var CRWNRR_Token = artifacts.require("./CRWNRR_Token.sol");
var CRWNRR_Crowdsale = artifacts.require("./CRWNRR_Crowdsale.sol");
var CRWNRR_RefundVault = artifacts.require("./CRWNRR_RefundVault.sol");
var CRWNRR_Wallet = artifacts.require("./CRWNRR_Wallet.sol");
var CRWNRR_Milstone = artifacts.require("./CRWNRR_Milstone.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, CRWNRR_Token);
  deployer.deploy(CRWNRR_Token);
  deployer.deploy(CRWNRR_Milstone);
  deployer.deploy(CRWNRR_Crowdsale);
  deployer.deploy(CRWNRR_RefundVault);
  deployer.deploy(CRWNRR_Wallet);
};
