import "document-register-element";
import $ from "jquery";
import template from "./account.html";
import Popper from "popper.js";
import bootstrap from "bootstrap"
import Chart from "chart.js";
import WalletGenerator from "../../wallet-generator/wallet-generator-3";

export default class DashboardAccount extends HTMLElement
{
	constructor(inWallet, inWeb3Instance)
	{
		super();
    this._mInfo = inWallet;
    this.web3 = inWeb3Instance;
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
  }

getBalance ()
{

  let test = this.web3.eth.getBalance(this._mAddr)
  .then((result)=> {
        let balance = web3.utils.fromWei(result.toNumber(), "ether");
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
