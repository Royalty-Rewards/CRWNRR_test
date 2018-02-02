var ConvertLib = artifacts.require("./ConvertLib.sol");
var CRWNToken = artifacts.require("./CRWNToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, CRWNToken);
  deployer.deploy(CRWNToken);
};
