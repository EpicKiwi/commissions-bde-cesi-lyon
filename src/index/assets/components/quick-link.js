import {LitElement, html} from "lit-element";

class QuickLinkComponent extends LitElement {

    static get properties(){return {
        href: {type: String},
        icon: {type: String},
        style: {type: String}
    }}

    render() {

        let icon = this.icon ? html`<bde-icon icon="${this.icon}"></bde-icon>` : ""

        return html`
        <style>
        
        :host(){
            display: inline-block;
        }
        
        .wrapper {
            display: inline-block;
            border: solid 2px var(--primary-color);
            border-radius: 5px;
            color: var(--primary-color);
        }
        
        .wrapper:hover {
            background: rgba(233, 69, 69, 0.2);
        }
        
        .wrapper.special {
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
        }
        
        .wrapper.special:hover {
            background-clip: border-box;
            -webkit-background-clip: border-box;
            color: var(--on-primary-color);
        }
        
        a {
            display: inline-block;
            padding: 10px;
            font-size: 18px;
            font-weight: normal;
            color: inherit;
            text-decoration: inherit;
        }
        </style>
        <div class="wrapper ${this.style}">
            <a href="${this.href}">
                ${icon}
                <span class="text"><slot></slot></span>
            </a>
        </div>
        `
    }

}

customElements.define("bde-quicklink", QuickLinkComponent)