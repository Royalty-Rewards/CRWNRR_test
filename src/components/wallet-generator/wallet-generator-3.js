import "document-register-element";
import Web3 from "web3";
import ethers from "ethers";
import $ from "jquery";
import template from "./wallet-generator-3.html";

const kEnterSeedPrompt = "Please enter a valid seed";
//Generate 2 address for each wallet by default..()
const kNumInitialAddresses = 1;
//Ethereum test network port...
const kNetworkAddress = "http://localhost:8545";
const kMaxGasPerTransaction = 21000;
const kMMHDPathtring = " m/44'/60'/0'/0";
const kHDPathtring = "m/0'/0'/0'";

//Creates an instance of a Hierarchical Derivation Wallet aka HD Wallet
export default class WalletGenerator extends HTMLElement
{

	constructor(inWalletReadyCallback)
	{
		super();
		this.innerHTML = template;
    // this._mWallet = new ethers.Wallet();
		//FOR DEV PURPOSES ONLY!!
		this._mSeedToKSMap = new Map();
		this._mSeedToPwMap = new Map();
    this._walletReady = inWalletReadyCallback;
	}

	// Fires when an instance was removed from the document.
	disconnectedCallback()
	{
		$(this).find("button.gen-send").off("click");
		$(this).find("button.wallet-gen-addr").off("click");
		$(this).find("button.wallet-gen-seed").off("click");
	}

	// Fires when an instance was inserted into the document.
	connectedCallback()
	{
		$(this).find("button.brain-gen.create").on("click", this.createWallet.bind(this));
		// $(this).find("input.brain-gen").on("change", this.addAccount.bind(this));
		// this._mWalletSelect = $(this).find(".wallet-id");

	}

	createWallet(inEvent)
	{
    let inputFieldValues = $(this).find("input.brain-gen");
    if($(this).find("input.brain-gen.pw").val() === $(this).find("input.brain-gen.confirm").val())
    {
      var username = new ethers.utils.toUtf8Bytes($(this).find("input.brain-gen.user").val());
      var password = new ethers.utils.toUtf8Bytes($(this).find("input.brain-gen.pw").val());
      $(this).find("button.close").trigger("click");
      // showLoading('Summoning Brain Wallet...');
      // cancelScrypt = false;
      var self = this;
      ethers.Wallet.fromBrainWallet(username, password).then(function(wallet) {
          console.log(wallet);
          self._walletReady(wallet);
      }, function (error) {
          if (error.message !== 'cancelled') {
              alert('Unknown error');
          }
          showSelect();
      });
    }
	}

	addAccount()
	{

	}

	generateAddress(seed)
	{

	}

	sendEther()
	{

	}
}

// function generateAddrListItemEl(wallet, address, privKey, balance)
// {
// 	return "<li>"
// 					+ "<p><b>Wallet: </b>0x" + wallet + "</p>"
// 					+ "<p><b>Address: </b>0x" + address + "</p>"
// 					+ "<p><b>Private Key: </b>0x" + privKey + "</p>"
// 					+ "<p><b>Balance: </b>" + balance + " ether</p>"
// 					+ "</li>";
// }

customElements.define("wallet-generator", WalletGenerator);
