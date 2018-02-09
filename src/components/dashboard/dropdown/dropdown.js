import "document-register-element";
import $ from "jquery";
// import template from "./dark-admin/index.html";
import template from "./dropdown.html";
import Popper from "popper.js";
import bootstrap from "bootstrap"

export default class Dropdown extends HTMLElement
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
		$(this).find('.dropdown').on('show.bs.dropdown', function () {
				$(this).find('.dropdown-menu').first().stop(true, true).fadeIn(100).addClass('active');
		});
		$(this).find('.dropdown').on('hide.bs.dropdown', function () {
				$(this).find('.dropdown-menu').first().stop(true, true).fadeOut(100).removeClass('active');
		});
	}
}

customElements.define("crwnrr-dropdown", Dropdown);
