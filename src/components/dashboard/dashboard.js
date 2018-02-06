import "document-register-element";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import template from "./dashboard.html";

export default class Dashboard extends HTMLElement
{

	constructor()
	{
		super();
		this.innerHTML = template;
	}

	// Fires when an instance was removed from the document.
	disconnectedCallback()
	{

	}

	// Fires when an instance was inserted into the document.
	connectedCallback()
	{

	}
}

customElements.define("crwnrr-dashboard", Dashboard);
