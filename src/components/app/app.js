// Import the page's CSS. Webpack will know what to do with it.
import "./app.css";
import $ from "jquery";
import style from "style-loader!../../../node_modules/bootstrap/dist/css/bootstrap.css";
import WalletGenerator from "../wallet-generator/wallet-generator";
import ContractGenerator from "../contract-generator/contract-generator";
import Web3 from "web3";

export default class App
{
  constructor()
  {

  }

  start()
  {
    $("body").append(new WalletGenerator());
    //$("body").append(new ContractGenerator());
  }
}

window.addEventListener('load', function() {
  //Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }
  window.app = new App();
  window.app.start();
});
