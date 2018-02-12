import "document-register-element";
import $ from "jquery";
import template from "./account.html";
import Popper from "popper.js";
import bootstrap from "bootstrap"
import Chart from "chart.js";
import WalletGenerator from "../../wallet-generator/wallet-generator-3";

export default class DashboardAccount extends HTMLElement
{
	constructor(inAccount, inWeb3)
	{
		super();
    this._mInfo = inAccount;
    this.web3 = inWeb3;
    this.innerHTML = template;
		this.classList.add("container-fluid");
    this._mPrivKey = inWallet.privateKey;
    this._mAddr = inWallet.address;
    this.updateAccountInfo(this._mInfo);
	}

	// Fires when an instance was removed from the document.
	disconnectedCallback()
	{

	}

	// Fires when an instance was inserted into the document.
	connectedCallback()
	{
		if(this._mAddr === 0x6acb15245dbf5913a9227e9ff857918268218cf4)
		{
		  let token = new this.web3.eth.CRWNRR_Token({from: this._mAddr});
		}
	}

  updateAccountInfo(inWallet)
  {
    for(let field in inWallet)
    {
      $(this).find("."+field).text(inWallet[field]);
    }
    let chartEl = $(this).find("canvas.chart")[0];
    this.getBalance();
    this._mChart = new Chart(chartEl, {
        type: 'doughnut',
        options: {
            cutoutPercentage: 90,
            legend: {
                display: false
            }
        },
        data: {
            labels: [
                "Balance",
            ],
            datasets: [
                {
                    data: [100],
                    borderWidth: [0],
                    backgroundColor: [
                        '#6933b9',
                    ],
                    hoverBackgroundColor: [
                        '#6933b9',
                    ]
                }]
        }
    });
    // let wallet CRWNRR_Token.new({from: creator});
    // // let provider = ethers.providers.getDefaultProvider();
    // let contract = new ethers.Contract(address, abi, provider);
    // // Create a wallet to deploy the contract with
    // let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
    // let wallet = new ethers.Wallet(privateKey, provider);
    //
    // // Send the transaction
    // let sendPromise = wallet.sendTransaction(deployTransaction);
    // // Get the transaction
    // sendPromise.then(function(transaction) {
    //     console.log(transaction);
    // });
    //
    // web3Provider.listAccounts().then(function(accounts) {
    //     var signer = web3Provider.getSigner(accounts[1]);
    //     console.log(signer);
    // });
  }

getBalance ()
{

  let test = this.web3.eth.getBalance(this._mAddr)
  .then((result)=> {
		console.log(result);
        let balance = web3.utils.fromWei(result, "ether");
        $(this).find(".balance").text(balance);
        console.log(result);
    });
  //console.log(test);
  //   let balance = web3.utils.fromWei(result.toNumber(), "ether");
  //   $(this).find(".balance").text(balance);
  //   console.log(result);
  // });
  // web3.eth.getBalance(this._mAddr)
  // .then((result)=> {
  //       let balance = web3.utils.fromWei(result.toNumber(), "ether");
  //       $(this).find(".balance").text(balance);
  //       console.log(result);
  //   });
}

}

customElements.define("crwnrr-dashboard-account", DashboardAccount);
