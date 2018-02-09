import "document-register-element";
import $ from "jquery";
import template from "./wallet.html";
import Popper from "popper.js";
import bootstrap from "bootstrap"
import Chart from "chart.js";
import WalletGenerator from "../../wallet-generator/wallet-generator-3";

export default class DashboardWallet extends HTMLElement
{
	constructor(inInfo = {})
	{
		super();
    this._mInfo = inInfo;
    //If no existing wallet is found, create one..
    if(!this._mInfo.wallet)
    {
      this.appendChild(new WalletGenerator(this.updateWalletInfo.bind(this)));
    }
    else
    {
        this.innerHTML = template;
    }

		this.classList.add("container-fluid");
    this._mInfo = inInfo;
	}

	// Fires when an instance was removed from the document.
	disconnectedCallback()
	{

	}

	// Fires when an instance was inserted into the document.
	connectedCallback()
	{

	}

  updateWalletInfo(inWallet)
  {
    this.innerHTML = template;
  }

}

customElements.define("crwnrr-dashboard-wallet", DashboardWallet);
