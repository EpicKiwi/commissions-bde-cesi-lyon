import {LitElement, html} from "lit-element";
import {animate} from "@index/libs/animate";
import { styleMap } from 'lit-html/directives/style-map';

// TODO : Meilleur ergonomie mobile, passage à la slide suivante avec un tap sur l'arrière plan

class ParallaxCarousel extends LitElement {

    static get properties(){ return {
        currentSlide: {type: Number},
        slideDuration: {type: Number},
        slideProgression: {type: Number}
    }}

    constructor() {
        super();
        this.slideProgression = 0
        this.slideDuration = 10000
    }

    update(changedProperties) {
        if(changedProperties.has("currentSlide")){
            let shouldAnimate =
                changedProperties.get("currentSlide") == this.slides.length - 1 ||
                this.currentSlide - 1 == changedProperties.get("currentSlide")
            this.focusSlide(this.currentSlide, shouldAnimate)
        }
        super.update(changedProperties)
    }

    connectedCallback() {
        super.connectedCallback()
        requestAnimationFrame(() => this.currentSlide = 0)
        this.start()
    }

    start(){
        this.$timeout = setTimeout(() => {
            this.slideProgression++
            if(this.slideProgression >= 100){
                this.nextSlide()
                this.slideProgression = 0
            }
            this.start()
        }, this.slideDuration/100)
    }

    pause(){
        clearTimeout(this.$timeout)
    }

    get slides(){
        return Array.from(this.querySelectorAll("bde-parallax-carousel-slide"))
    }

    get currentSlideEl(){
        return this.querySelector("bde-parallax-carousel-slide.carousel-focused") || this.slides[this.currentSlide]
    }

    async focusSlide(index, shouldAnimate= true){

        if(this.slides.length == 0){
            return
        }

        let fromSlide = this.currentSlideEl
        let toSlide = this.slides[index]

        if(!shouldAnimate){
            fromSlide.classList.remove("carousel-focused")
            toSlide.classList.add("carousel-focused")
            return
        }

        fromSlide.classList.add("carousel-transition")
        toSlide.classList.add("carousel-transition")

        await Promise.all([
            fromSlide.animateLeave(),
            toSlide.animateEnter()
        ])

        fromSlide.classList.remove("carousel-focused")
        toSlide.classList.add("carousel-focused")

        fromSlide.classList.remove("carousel-transition")
        toSlide.classList.remove("carousel-transition")

    }

    nextSlide(){
        this.currentSlide = (this.currentSlide + 1) % this.slides.length
    }

    previousSlide(){
        this.currentSlide -= 1
        if(this.currentSlide < 0){
            this.currentSlide = this.slides.length + this.currentSlide
        }
    }

    render() {

        let progress = ""

        if(this.slides.length > 1) {
            progress = this.slides.map((e, i) => {
                let style = styleMap({
                    width: this.slideProgression + "%",
                    "transition-duration": this.slideDuration / 100 + "ms"
                })

                if (i < this.currentSlide) {
                    style = styleMap({
                        width: "100%",
                        "transition": "none"
                    })
                } else if (i > this.currentSlide) {
                    style = styleMap({
                        width: "0%",
                        "transition": "none"
                    })
                }
                return html`<div class="progress" @click="${() => {
                    this.currentSlide = i;
                    this.slideProgression = 0
                }}">
                <div class="progression" style="${style}"></div>
            </div>`
            })
        }

        return html`
            <style>
            :host {
                width: 100%;
                display: block;
                background: black;
            }
            
            .content, .wrapper {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            
            .wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            ::slotted(*) {
                position: absolute;
                top: 0;
                left: -50px;
                width: calc(100% + 100px);
                height:100%;
            }
            
            ::slotted(.carousel-transition) {
                display: block;
                z-index: 10;
            }
            
            ::slotted(.carousel-focused) {
                display: block;
                z-index: 20;
            }
            
            .progress-bars {
                width: calc(100% - 25px);
                position: absolute;
                top: 0;
                left: 0;
                padding: 10px;
                display: flex;
                flex-direction: row;
                justify-content: stretch;
                align-items: center;
                z-index: 50;
            }
            
            .progress-bars .progress {
                flex: 1;
                height: 5px;
                border-radius: 10px;
                background-color: rgba(255, 255, 255, 0.5);
                overflow: hidden;
                cursor: pointer;
            }
            
            .progress-bars .progress:not(:last-child) {
                margin-right: 5px;
            }
            
            .progress-bars .progress .progression {
                background-color: rgba(255, 255, 255, 1);
                height: 100%;
                transition: linear width;
            }
            
            .next-slide-button {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                width: 30%;
                background: transparent;
                z-index: 20;
            }
            
            .previous-slide-button {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 30%;
                background: transparent;
                z-index: 20;
            }
            
            </style>
            <div class="wrapper" @mouseenter="${() => this.pause()}" @mouseleave="${() => this.start()}">
                <div class="progress-bars">${progress}</div>
                <div class="content">
                    <slot></slot>
                </div>
                <div class="next-slide-button" @click="${() => this.nextSlide()}"></div>
                <div class="previous-slide-button" @click="${() => this.previousSlide()}"></div>
            </div>
        `
    }

}

customElements.define("bde-parallax-carousel", ParallaxCarousel)

class ParallaxCarouselSlide extends LitElement {

    animateEnter(){
        return animate(this, "enter")
    }

    animateLeave(){
        return animate(this, "leave")
    }

    render() {
        return html`
            <style>
            :host {
                width: 100%;
                height: 100%;
                display: block;
            }
            
            ::slotted(*){
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            ::slotted([data-carousel-role="background"]) {
                width: calc(100% + 20px);
                left: -10px;
            }
            
            ::slotted([data-carousel-role="foreground"]) {
                padding: 0 60px !important;
                box-sizing: border-box;
            }
            
            :host(.animate-leave-active), :host(.animate-enter-active) {
                transition-duration: 0.5s;
            }
            
            :host(.animate-leave-active) ::slotted(*) {
                transition: ease-in 0.5s;
                transition-property: opacity, transform;
            }
            
            :host(.animate-leave) ::slotted(*), :host(.animate-enter-end) ::slotted(*) {
                opacity: 1;
                transform: translateX(0px);
            }
            
            :host(.animate-leave-end) ::slotted([data-carousel-role="background"]) {
                opacity: 0;
                transform: translateX(-50px);
            }
            
            :host(.animate-leave-end) ::slotted([data-carousel-role="foreground"]) {
                opacity: 0;
                transform: translateX(-100px);
            }
            
            :host(.animate-enter-active) ::slotted(*) {
                transition: ease-out 0.5s;
                transition-property: opacity, transform;
            }
            
            :host(.animate-enter) ::slotted([data-carousel-role="background"]) {
                opacity: 0;
                transform: translateX(50px);
            }
            
            :host(.animate-enter) ::slotted([data-carousel-role="foreground"]) {
                opacity: 0;
                transform: translateX(100px);
            }
            
            </style>
            <slot></slot>
        `
    }

}

customElements.define("bde-parallax-carousel-slide", ParallaxCarouselSlide)