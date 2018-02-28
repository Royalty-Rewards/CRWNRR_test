import regeneratorRuntime from "regenerator-runtime";
import web3 from "web3";
require('babel-register');
require('babel-polyfill');

const BigNumber = web3.BigNumber;
const EVMRevert = "revert";
let goal = 500;

// var OPAC = artifacts.require('./contracts/OPAC.sol');
//
// contract('OPAC', function (accounts) {
//   let opacInstance;
//   var owner = accounts[0];
//   var shareholders = [accounts[1],accounts[2],accounts[3],accounts[4]];
//   it('should create an OPAC', async function () {
//
//   });
// });
//
// function ether (n) {
//   return new web3.BigNumber(web3.toWei(n, 'ether'));
// }
