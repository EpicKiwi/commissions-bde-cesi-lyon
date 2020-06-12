import {LitElement, html} from "lit-element";

class FakeSearchComponent extends LitElement {

    static get properties(){return{
        searchbox: {type: String},
        explicit: {type: Boolean},
    }}

    showSearchbox() {
        let el = document.querySelector(this.searchbox)
        if(el){
            el.show = true
        }
    }

    render() {
        return html`
        <style>
        :host() {
            display: block;
        }
        
        .wrapper {
            padding: 5px 10px;
        }
        
        .fake-search {
            display: flex;
            flex-direction: row;
            cursor: text;
            border-radius: 5px;
        }
        
        .fake-search.explicit {
            background: #f4f4f4;
        }
        
        .placeholder {
            flex: 1;
            padding: 10px 25px 10px 0;
            color: rgba(0,0,0,0.4);
        }
        
        .icon {
            font-size: 25px;
            padding: 5px 10px 5px 5px;
        }
        </style>
        <div class="wrapper" @click="${() => this.showSearchbox()}">
            <div class="fake-search ${this.explicit ? "explicit" : ""}">
                <div class="icon" >
                    <bde-icon icon="mdi-magnify"></bde-icon>
                </div>
                <div class="placeholder"><slot>Recherche</slot></div>
            </div>
        </div>
        `
    }
}

customElements.define("bde-fake-search", FakeSearchComponent)