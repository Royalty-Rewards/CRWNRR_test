import "document-register-element";
import Web3 from "web3";
import lightwallet from "eth-lightwallet/index.js";
import HookedWeb3Provider from "hooked-web3-provider";
import $ from "jquery";
import template from "./wallet-generator.html";

const kEnterSeedPrompt = "Please enter a valid seed";
//Generate 2 address for each wallet by default..()
const kNumInitialAddresses = 2;
//Ethereum test network port...
const kNetworkAddress = "http://localhost:8545";
const kMaxGasPerTransaction = 21000;
const kMMHDPathtring = " m/44'/60'/0'/0";
const kHDPathtring = "m/0'/0'/0'";
//Creates an instance of a Hierarchical Derivation Wallet aka HD Wallet
export default class WalletGenerator extends HTMLElement{

	constructor()
	{
		super();
		this.innerHTML = template;
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
		$(this).find("button.wallet-gen-send").on("click", this.send_ether.bind(this));
		$(this).find("button.wallet-gen-addr").on("click", this.generate_addresses.bind(this));
		$(this).find("button.wallet-gen-seed").on("click", this.generate_seed.bind(this));
	}

	generate_seed()
	{
		let new_seed = lightwallet.keystore.generateRandomSeed();
		document.getElementById("seed").value = new_seed;
		this.generate_addresses(new_seed);
	}

	generate_addresses(seed)
	{
		if(!seed)
		{
			try
			{
				seed = document.getElementById("seed").value;
				if(!seed){ throw("seed value not found..."); }
			}
			catch (e)
			{
				console.warn("Error: " + e);
				return;
			}
		}
		if(!lightwallet.keystore.isSeedValid(seed))
		{
			document.getElementById("info").innerHTML = kEnterSeedPrompt;
			return;
		}
		let password = Math.random().toString();
		//create keystore instance where password will be encrypted, and stored
		lightwallet.keystore.createVault({
			password: password,
			seedPhrase: seed,
			hdPathString: kHDPathtring
			},
		function(err, ks)
		{
				//note: keystore was created using only password, and seed phrase...
				//to make keystore more secure, use HdPathString, and salt...
		  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
		    	if(err)
		    	{
		    		document.getElementById("info").innerHTML = err;
		    	}
		    	else
		    	{
		    		ks.generateNewAddress(pwDerivedKey, kNumInitialAddresses);
		    		const addresses = ks.getAddresses();
		    		const web3 = new Web3(new Web3.providers.HttpProvider(kNetworkAddress));
		    		let html = "";
		    		for(let address of addresses)
		    		{
							try
							{
								let list = document.getElementById("list");
								if(!list){ throw("address list not found"); }
							}
							catch (e)
							{
								return;
							}
							let balance = web3.eth.getBalance(address);
							let privateKey = ks.exportPrivateKey(address, pwDerivedKey);
							list.innerHTML += generateAddrListItemEl(address, privateKey, balance);
		    		}
		    	}
		  	});
		});
	}

	send_ether()
	{
		let	seed = document.getElementById("seed").value;
		if(!lightwallet.keystore.isSeedValid(seed))
		{
			document.getElementById("info").innerHTML = kEnterSeedPrompt;
			return;
		}
		const password = Math.random().toString();
		lightwallet.keystore.createVault({
			password: password,
		  	seedPhrase: seed
		}, function (err, ks) {
		  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
		    	if(err)
		    	{
		    		document.getElementById("info").innerHTML = err;
						return;
		    	}
		    	else
		    	{
		    		ks.generateNewAddress(pwDerivedKey, totalAddresses);
		    		ks.passwordProvider = function (callback) {
				      	callback(null, password);
				    };
				    const provider = new HookedWeb3Provider({
	  					host: kNetworkAddress,
	  					transaction_signer: ks
					});
				  const web3 = new Web3(provider);
				  const from = document.getElementById("address1").value;
					const to = document.getElementById("address2").value;
				  const value = web3.toWei(document.getElementById("ether").value, "ether");
				  web3.eth.sendTransaction(
						{
				    	from: from,
				    	to: to,
				    	value: value,
				    	gas: kMaxGasPerTransaction
				    },
						function(error, result)
						{
				    	if(error)
				    	{
				    		document.getElementById("info").innerHTML = error;
				    	}
				    	else
				    	{
				    		document.getElementById("info").innerHTML = "Txn hash: " + result;
				    	}
				    })
		    	}
		  	});
		});
	}
}

function generateAddrListItemEl(address, privKey, balance)
{
	return "<li>" + "<p><b>Address: </b>0x" + address + "</p>"
					+ "<p><b>Private Key: </b>0x" + privKey + "</p>"
					+ "<p><b>Balance: </b>" + balance + " ether</p>"
					+ "</li>";
}

customElements.define("wallet-generator", WalletGenerator);
