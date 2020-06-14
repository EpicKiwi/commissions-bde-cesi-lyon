import {html, LitElement} from "lit-element"
import "@index/components/loading"
import "@index/components/tooltip"
import {apiClient} from "@index/libs/apiClient"

class FlushingCheckboxComponent extends LitElement {

	static get properties() {return {
		loadingSize: {type: String},
		loading: {type: Boolean},
		requestPath: {type: String},
		responsePath: {type: String},
		src: {type: String},
		hasError: {type: Boolean}
	}}

	constructor(){
		super();
		this.contentChanged = this.contentChanged.bind(this)
	}

	get computedRequestPath(){
		if(this.requestPath){
			return this.requestPath;
		}
		if(this.children[0]){
			return this.children[0].name || this.children[0].id || "value"
		}
		return "value"
	}

	get computedResponsePath(){
		if(this.responsePath){
			return this.responsePath;
		}
		if(this.requestPath){
			return this.requestPath;
		}
		if(this.children[0]){
			return this.children[0].name || this.children[0].id || "value"
		}
		return "value"
	}

	firstUpdated(changedProps){
		super.firstUpdated(changedProps)
		this.addEventListener("change", this.contentChanged)
	}

	contentChanged(e){
		if(this.src){
			this.flush(e.target.checked, e.target)
		}
	}

	async flush(value, sourceElement){
		let request = this.buildObjectFromPath(this.computedRequestPath,value)
		let response = null
		this.hasError = false
		try {
			this.loading = true;
			response = await apiClient.apiCall(this.method || "POST", this.src, request, true)
		} catch(e){
			console.error("Error flushing checkbox :", e)
			if(sourceElement){
				this.rollbackValue(sourceElement)
			}
			this.hasError = true
			this.loading = false;
			return false;
		}
		this.loading = false;
		if(response){
			let newValue = this.getValueOfPath(this.computedResponsePath, response)
			if(newValue !== undefined){
				this.setValue(newValue, sourceElement)
			}
			return true;
		}
		return false;
	}

	update(changedProps){
		super.update(changedProps)
		if(changedProps.has("loading")){
			if(this.loading){
				Array.from(this.children).forEach(el => el.disabled = true)
			} else {
				Array.from(this.children).forEach(el => el.disabled = false)
			}
		}
	}

	setValue(value, sourceElement){
		if(sourceElement){
			sourceElement.checked = value;
		} else {
			Array.from(this.children).forEach(el => el.checked = value)
		}
	}

	rollbackValue(sourceElement){
		sourceElement.checked = !sourceElement.checked;
	}

	buildObjectFromPath(path,value){
		let fullObject = {}
		path.split(".").reduce((acc, el, i, chunks) => {
			acc[el] = i < chunks.length-1 ? {} : value
			return acc[el]
		}, fullObject)
		return fullObject
	}

	getValueOfPath(path, fromObject){
		return path.split(".").reduce((acc, el, i, chunks) => {
			if(typeof acc != "object") return acc;
			return acc[el]
		}, fromObject)
	}

	render(){

		return html`
		<style>
		:host(){
			display: inline-block;
		}

		.wrapper {
			position: relative;
		}

		.wrapper, bde-tooltip {
			display: inline-block;
		}

		.loading-panel {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}

		.content.hidden::slotted(*) {
			opacity: 0;	
		}

		.loading-panel.hidden {
			display: none;
		}
		</style>
		<bde-tooltip nohover flavor="danger" ?show=${this.hasError} anchor="left" content="Érreur inconnue">
			<div class="wrapper">
				<bde-loading class="loading-panel ${!this.loading ? "hidden" : ""}" size="${this.loadingSize}"></bde-loading>
				<slot class="content ${this.loading ? "hidden" : ""}"></slot>
			</div>
		</bde-tooltip>`
	}

}

customElements.define("bde-flushing-checkbox", FlushingCheckboxComponent);