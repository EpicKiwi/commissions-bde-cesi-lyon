import {html, LitElement} from "lit-element";
import '@index/components/loading'
import {animate} from "@index/libs/animate"

/**
* Component d'un bouton
*
* CSS: 
* --primary-color
* --on-primery-color
* --danger-color
* --on-danger-color
* --success-color
* --on-success-color
*
* Properties :
* icon : Icon ajouté avant le bouton
* disabled : Désactive le bouton
* loading : indique que l'action est indisponible a cause d'un chargement
*
* Classes:
* small
* medium
* large
* primary
* danger
* success
* transparent
* block
* merged-left
* merged-right
*/
class ButtonComponent extends LitElement {

	static get properties() { return {
		icon: {type: "string"},
		disabled: {type: Boolean},
		loading: {type: Boolean}
	}}

	get isClickable(){
		return !(this.disabled || this.loading)
	}

	update(changedProperties){
		super.update(changedProperties)
		if(changedProperties.has("loading")){
			let btn = this.shadowRoot.getElementById("btn")
			if(btn){
				if(this.loading){
					animate(btn, "loading-enter");
				} else {
					animate(btn, "loading-leave");
				}
			}
		}
	}

	render(){

		let iconSize = "20px"
		if(this.classList.contains("medium")){
			iconSize = "24px"
		} else if(this.classList.contains("large")){
			iconSize = "30px"
		}

		return html`<style>
			* {
				box-sizing: border-box;
			}

			:host() {
				display: inline-block;
				width: auto;
				height: auto;
			}

			:host(.block) {
				display: block
			}

			.main-button {
				border: solid 2px;
				background: transparent;
				border-radius: 5px;

				display: inline-flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				cursor: pointer;

				position: relative;
			}

			:host(.block) .main-button {
				display: flex;
				width: 100%;
				height: 100%;
			}

			.main-button.loading > *:not(.loading-panel) {
				opacity: 0;
			}

			.loading-panel {
				display: none;
			}

			.main-button .loading-panel {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				display: none;
				opacity: 0;
			}

			.main-button.loading .loading-panel {
				opacity: 1;
				display: block;
			}

			.main-button:disabled {
				cursor: default;
			}

			.main-button.disabled {
				opacity: 0.5;
			}

			.text-area {
				/*flex: 1;*/
			}

			:host(:empty) .text-area {
				display:none;
			}

			.hidden {
				display: none;
			}

			/* ---- Animation ---- */

			.main-button {
				transition-duration: 0.1s;
				transition-property: background color border-color;
			}

			.main-button.animate-loading-enter-active, .main-button.animate-loading-leave-active {
				transition-duration: 0.1s;
			}

			.main-button.animate-loading-enter-active > *, .main-button.animate-loading-leave-active > * {
				transition: 0.1s linear;
				transition-property: opacity transform;
			}

			.main-button.animate-loading-enter > *:not(.loading-panel) {
				opacity: 1;
			}

			.main-button.animate-loading-enter > .loading-panel {
				opacity: 0;
				display: block;
				transform: scale(2);
			}

			.main-button.animate-loading-leave > *:not(.loading-panel) {
				opacity: 0;
			}

			.main-button.animate-loading-leave > .loading-panel {
				opacity: 1;
				display: block;
			}

			/* ---- Merge ---- */

			:host(.merged-right) .main-button {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				border-right-width: 1px;
			}

			:host(.merged-left) .main-button {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-left-width: 1px;
			}

			/* ---- Styles ---- */

			.main-button, :host(.primary) .main-button {
				border-color: var(--primary-color, #262626);
				color: var(--primary-color, #262626);
			}

			.main-button:hover:not(:disabled), :host(.primary) .main-button:hover:not(:disabled) {
				background: var(--primary-color, #262626);
				color: var(--on-primary-color, white);
			}

			:host(.danger) .main-button {
				border-color: var(--danger-color, #f44138);
				background: var(--danger-color, #f44138);
				color: var(--on-danger-color, white);
			}

			:host(.danger) .main-button:hover:not(:disabled) {
				background: transparent;
				color: var(--danger-color, #f44138);
			}

			:host(.success) .main-button {
				border-color: var(--success-color, #26cc45);
				background: var(--success-color, #26cc45);
				color: var(--on-success-color, white);
			}

			:host(.success) .main-button:hover:not(:disabled) {
				background: transparent;
				color: var(--success-color, #26cc45);
			}

			:host(.transparent) .main-button {
				border-color: white;
				color: white;
			}

			:host(.transparent) .main-button:hover:not(:disabled) {
				background: rgba(255,255,255,0.2);
			}

			/* ---- Sizes ---- */

			.main-button, :host(.small) .main-button {
				padding: 0 5px;
				height: 30px;
			}

			.text-area, :host(.small) .text-area {
				font-size: 15px;
				padding: 5px;
			}

			.icon-area, :host(.small) .icon-area {
				font-size: 20px;
			}

			:host(.medium) .main-button {
				padding: 0 10px;
				height: 45px;
			}

			:host(.medium) .text-area {
				font-size: 17px;
				padding: 10px 5px;
			}

			:host(.medium) .icon-area {
				font-size: 24px;
			}

			:host(.large) .main-button {
				padding: 0 15px;
				height: 58px;
			}

			:host(.large) .text-area {
				font-size: 20px;
				padding: 15px 10px;
			}

			:host(.large) .icon-area {
				font-size: 30px;
			}

		</style><!--
		--><button id="btn" class="main-button ${this.loading ? "loading" : ""} ${this.disabled ? "disabled" : ""}" ?disabled=${!this.isClickable}>
			<div class="loading-panel"><bde-loading size="${iconSize}"></bde-loading></div>
			<div class="icon-area ${!this.icon ? "hidden" : ""}">
				<bde-icon icon="${this.icon}"></bde-icon>
			</div>
			<div class="text-area">
				<slot></slot>
			</div>
		</button>`
	}

}

customElements.define("bde-button", ButtonComponent);