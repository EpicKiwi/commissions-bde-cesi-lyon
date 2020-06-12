import {LitElement, html} from "lit-element"
import Iconify from '@iconify/iconify'
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js'

class IconComponent extends LitElement {

	static get properties(){ return {
		icon: {type: "string"},
		svgContent: {type: "string"}
	}}

	connectedCallback(){
		super.connectedCallback()
	    document.addEventListener("IconifyAddedIcons",() => {
	        if(!this.icon)
	            return;

	        if(Iconify.iconExists(this.icon)) {
	            this.setIconSvg()
	        }
	    })
	}

	update(changedProperties){
		if(changedProperties.has("icon")){
			this.svgContent = ""
			this.requestIcon()
		}
		super.update(changedProperties)
	}

	setIconSvg(){
		let fontSize = window.getComputedStyle(this, null).getPropertyValue('font-size')

        let height = parseFloat(fontSize)

        this.svgContent = Iconify.getSVG(this.icon, isNaN(height) ? {} : {
            'data-height': height
        })
	}

    requestIcon(){
        if(!this.icon)
            return;

        if(Iconify.iconExists(this.icon)){
            this.setIconSvg()
        } else {
            Iconify.preloadImages([this.icon])
        }
    }

    render() {

        return html`<style>
	        :host {
	            display: inline-block;
	            font-size: inherit;
	            width: inherit;
	            height: inherit;
	        }
	        
	        svg {
	            width: auto;
	            height: 100%;
	        }
	    </style>
	    <span id="icon">${unsafeHTML(this.svgContent)}</span>`
    }

}

customElements.define("bde-icon", IconComponent);