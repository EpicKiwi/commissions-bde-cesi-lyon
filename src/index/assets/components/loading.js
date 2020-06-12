import {LitElement, html} from "lit-element";

class LoadingComponent extends LitElement {

    static get properties(){return {

    }}

    render() {

        return html`<style>
        	@keyframes loading-spin {
        		0%   { transform: rotate(0deg) }
        		100% { transform: rotate(360deg) }
        	}

        	:host() {
        		display: inline-block;
        	}

        	.loading-wrapper {
        		display: flex;
        		justify-content: center;
        		align-items: center;
        		width: 100%;
        		height: 100%;
        	}

        	.loading-wrapper .loader {
        		transform-origin: 46% 48%;
        		animation: loading-spin 1s linear infinite;
        	}
        </style>
        <div class="loading-wrapper">
        	<div class="loader">
        		<bde-icon icon="mdi-reload"></bde-icon>
        	</div>
        </div>`
    }

}

customElements.define("bde-loading", LoadingComponent)