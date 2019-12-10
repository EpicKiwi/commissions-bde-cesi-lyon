import {LitElement, html} from 'lit-element';

class Tag extends LitElement {
    static get properties() {
        return {
            color: {type: String}
        };
    }

    constructor() {
        super();
        this.color = "var(--secondary-bg-color)"
    }

    render() {

        let customStyle = `background-color: ${this.color}`

        return html`<style>
    
            :host {
                display: inline-block;
            }
            
            .tag {
                display: inline-block;
                padding:  5px;
                font-size: 12px;
                background-color: #1e1e1e;
                color: white;
                border-radius: 5px;
            }
            
            ::slotted(*) {
                font-size: 12px;
                color: white;
            }
            
            </style>
            <div class="tag" style="${customStyle}" id="tag">
                <slot></slot>
            </div>`;
    }
}

customElements.define('bde-tag', Tag);