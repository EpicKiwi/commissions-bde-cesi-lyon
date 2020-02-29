import {LitElement, html} from "lit-element";
import * as animate from "@index/libs/animate"

const ANCHORS = {
    CENTER: "center",
    LEFT: "left",
    RIGHT: "right"
}

class TooltipComponent extends LitElement {

    static get properties(){ return {
        content: {type: String},
        anchor: {type: String},
        show: {type: Boolean},
        animateKeep: {type: Boolean}
    }}

    connectedCallback() {
        super.connectedCallback()
        if(this.show)
            setTimeout(() => this.show(), 500)
    }

    updated(changedProperties) {
        if(changedProperties.has("show") && changedProperties.get("show") !== this.show){
            if(this.show){
                this.animateEnter()
            } else {
                this.animateKeep = true
                this.animateLeave().then(() => this.animateKeep = false)
            }
        }
    }

    async animateEnter(){
        const tooltipEl = this.shadowRoot.getElementById("tooltip")
        await animate.animate(tooltipEl,"enter")
    }

    async animateLeave(){
        const tooltipEl = this.shadowRoot.getElementById("tooltip")
        await animate.animate(tooltipEl,"leave")
    }

    render() {
        let anchorclass = Object.values(ANCHORS).indexOf(this.anchor) === -1 ? "center" : this.anchor

        return html`
        <style>
            :host {
                display: block;
            }
        
            .content {
                position: relative;
            }
            
            .tooltip {
                position: absolute;
                padding-bottom: 10px;
                left: 0;
                top: 0;
                transform: translateY(-100%);
                z-index: 1000;
                width: 100%;
            }
            
            .tooltip-content {
                display: inline-block;
                padding: 5px;
                background: var(--primary-color);
                color: var(--on-primary-color);
                border-radius: 5px;
                position: relative;
                cursor: default;
                text-align: left;
            }
            
            .tooltip-content.hidden {
                display: none;
            }
            
            .tooltip-content::after {
                content: "";
                display : inline-block;
                height : 0;
                width : 0;
                border-top : 5px solid var(--primary-color);
                border-right : 5px solid transparent;
                border-left : 5px solid transparent;
                
                position: absolute;
                bottom: -5px;
                z-index: 1001;
            }
            
            .content.left .tooltip-content::after {
                left: 15px;
            }
            
            .content.right .tooltip-content::after {
                right: 15px;
            }
            
            .content.center .tooltip-content::after {
                left: 50%;
                transform: translateX(-50%);
            }
            
            .content.left .tooltip {
                text-align: left;
            }
            
            .content.right .tooltip {
                text-align: right;
            }
            
            .content.center .tooltip {
                text-align: center;
            }
            
            .tooltip-content.animate-enter-active {
                transition: cubic-bezier(.09,.71,0,1) 300ms all;
            }
            
            .tooltip-content.animate-enter {
                opacity: 0;
                transform: translateY(50%);
            }
            
            .tooltip-content.animate-enter-end {
                opacity: 1;
                transform: translateY(0);
            }
            
            .tooltip-content.animate-leave-active {
                transition: ease 300ms all;
            }
            
            .tooltip-content.animate-leave {
                opacity: 1;
            }
            
            .tooltip-content.animate-leave-end {
                opacity: 0;
            }
            
        </style>
        <div class="content ${anchorclass}" @mouseenter="${() => this.show = true}" @mouseleave="${() => this.show = false}">
            <div class="tooltip">
                <div class="tooltip-content ${!this.show && !this.animateKeep ? "hidden": ""}" id="tooltip" @click="${() => this.show = false}">
                    ${this.content}
                </div>
            </div>
            <slot></slot>
        </div>
        `
    }

}

TooltipComponent.ACHORS = ANCHORS

customElements.define("bde-tooltip", TooltipComponent)