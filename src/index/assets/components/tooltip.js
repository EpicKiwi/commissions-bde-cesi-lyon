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
        forceHide: {type: Boolean},
        animateKeep: {type: Boolean},
        flavor: {type: String},
        noHover: {type: Boolean}
    }}

    connectedCallback() {
        super.connectedCallback()
        if(this.show) {
            this.show = false
            this.forceHide = true
            setTimeout( () => {
                this.forceHide = false
                this.show = true
            }, 500)
        }

        window.addEventListener("resize", () => this.show ? this.requestUpdate() : null)
    }

    updated(changedProperties) {
        if(changedProperties.has("show") && changedProperties.get("show") !== this.show){
            if(this.show){
                this.animateEnter()
            } else if(changedProperties.get("show") !== undefined) {
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

    get XPos(){
        let rect = this.getBoundingClientRect()
        switch(this.correctedAnchor){
            case "center":
                return rect.left + rect.width/2
            case "left":
                return rect.left
            case "right":
                return rect.left+rect.width
        }
    }

    get YPos(){
        let rect = this.getBoundingClientRect()
        return rect.top + window.pageYOffset
    }

    get correctedAnchor(){
        return Object.values(ANCHORS).indexOf(this.anchor) === -1 ? "center" : this.anchor
    }

    autoOpen(){
        if(!this.noHover){
            this.show = true;
        }
    }

    render() {
        let anchorclass = this.correctedAnchor

        return html`
        <style>
            :host {
                display: block;
            }
            
            .tooltip {
                position: absolute;
                padding-bottom: 10px;
                transform: translateY(-100%) translateX(-50%);
                z-index: 1500;
                max-width: 300px;
                opacity: 0.9;
                font-family: var(--paragraph-fonts, sans-serif);
            }
            
            .content.left .tooltip {
                transform: translateY(-100%) translateX(0);
            }
            
            .content.right .tooltip {
                transform: translateY(-100%) translateX(-100%);
            }
            
            .tooltip-content {
                display: inline-block;
                padding: 10px;
                background: #383838;
                color: white;
                border-radius: 5px;
                position: relative;
                cursor: default;
            }
            
            .primary .tooltip-content {
                background: var(--primary-color);
                color: var(--on-primary-color);
            }
            
            .secondary .tooltip-content {
                background: var(--secondary-color);
                color: var(--on-secondary-color);
            }
            
            .danger .tooltip-content {
                background: var(--danger-color, #f44138);
                color: var(--on-danger-color, white);
            }
            
            .success .tooltip-content {
                background: var(--success-color, #26cc45);
                color: var(--on-success-color, white);
            }
            
            .tooltip-content.hidden {
                display: none;
            }
            
            .tooltip-content::after {
                content: "";
                display : inline-block;
                height : 0;
                width : 0;
                border-top : 5px solid #383838;
                border-right : 5px solid transparent;
                border-left : 5px solid transparent;
                
                position: absolute;
                bottom: -5px;
                z-index: 101;
            }
            
            .primary .tooltip-content::after {
                border-top : 5px solid var(--primary-color);
            }
            
            .secondary .tooltip-content::after {
                border-top : 5px solid var(--secondary-color);
            }
            
            .danger .tooltip-content::after {
                border-top : 5px solid var(--danger-color, #f44138);
            }
            
            .success .tooltip-content::after {
                border-top : 5px solid var(--success-color, #26cc45);
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
        <div class="content ${anchorclass} ${this.flavor ? this.flavor : ""}" @mouseenter="${() => this.autoOpen()}" @mouseleave="${() => this.show = false}">
            <div class="tooltip" style="left: ${this.XPos}px; top: ${this.YPos}px">
                <div class="tooltip-content ${(!this.show && !this.animateKeep) || this.forceHide ? "hidden" : ""}" id="tooltip" @click="${() => this.show = false}">
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