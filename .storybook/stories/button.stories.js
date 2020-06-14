import { withActions } from '@storybook/addon-actions';
export default {
	title: "Button",
	parameters: {
	    backgrounds: [
	      { name: 'bright', value: 'white', default: true },
	      { name: 'dark', value: '#4f4f4f'}
	    ]
	},
	decorators: [withActions('click bde-button')]
}
import "@index/components/button"

export const simpleText = () => `
	<style>
	* {
    	--primary-color: #00a7e2;
    	--on-primary-color: white;
	}
	</style>

	<bde-button>I'm a button</bde-button>
	<bde-button class="danger">I'm a dangerous button</bde-button>
	<bde-button class="success">I'm a happy button</bde-button>
	<bde-button class="transparent">I'm a transparent button</bde-button>

	<br/>
	<br/>

	<bde-button disabled>I'm a button</bde-button>
	<bde-button class="danger" disabled>I'm a dangerous button</bde-button>
	<bde-button class="success" disabled>I'm a happy button</bde-button>
	<bde-button class="transparent" disabled>I'm a transparent button</bde-button>

	<br/>
	<br/>

	<bde-button class="small">Smol button</bde-button>
	<bde-button class="medium">Normal button</bde-button>
	<bde-button class="large">Large button</bde-button>

`

export const withIcon = () => `
	<style>
	* {
    	--primary-color: #00a7e2;
    	--on-primary-color: white;
	}
	</style>

	<bde-button icon="mdi-magnify">Search</bde-button>
	<bde-button class="danger" icon="mdi-auto-fix">Magic</bde-button>
	<bde-button class="success" icon="mdi-alien">They're coming !</bde-button>
	<bde-button class="transparent" icon="mdi-brightness-7">I'm a transparent button</bde-button>

	<br/>
	<br/>

	<bde-button icon="mdi-magnify" disabled>Search</bde-button>
	<bde-button class="danger" icon="mdi-auto-fix" disabled>Magic</bde-button>
	<bde-button class="success" icon="mdi-alien" disabled>They're coming !</bde-button>
	<bde-button class="transparent" icon="mdi-brightness-7" disabled>I'm a transparent button</bde-button>

	<br/>
	<br/>

	<bde-button icon="mdi-magnify" class="small">Smol button</bde-button>
	<bde-button icon="mdi-auto-fix" class="medium">Normal button</bde-button>
	<bde-button icon="mdi-alien" class="large">Large button</bde-button>

	<br/>
	<br/>

	<bde-button icon="mdi-magnify">Iconified Button</bde-button>
	<bde-button>Normal button</bde-button>
	<bde-button icon="mdi-alien">Another icon</bde-button>
`

export const loading = () => `
	<style>
	* {
    	--primary-color: #00a7e2;
    	--on-primary-color: white;
	}
	</style>

	<bde-button icon="mdi-magnify" loading>Search</bde-button>
	<bde-button class="danger" icon="mdi-auto-fix" loading>Magic</bde-button>
	<bde-button class="success" icon="mdi-alien" loading>They're coming !</bde-button>
	<bde-button class="transparent" icon="mdi-brightness-7" loading>I'm a transparent button</bde-button>


	<br/>
	<br/>

	<bde-button icon="mdi-magnify" disabled loading>Search</bde-button>
	<bde-button class="danger" icon="mdi-auto-fix" disabled loading>Magic</bde-button>
	<bde-button class="success" icon="mdi-alien" disabled loading>They're coming !</bde-button>
	<bde-button class="transparent" icon="mdi-brightness-7" disabled loading>I'm a transparent button</bde-button>

	<br/>
	<br/>
	<p>
	<bde-button
		class="small"
		onclick="this.loading = true; setTimeout(() => this.loading = false, 2000)"
	>Smol button</bde-button>
	<bde-button
		icon="mdi-upload"
		class="medium"
		onclick="this.loading = true; setTimeout(() => this.loading = false, 2000)"
	>Envoyer</bde-button>
	<bde-button
		class="large"
		onclick="this.loading = true; setTimeout(() => this.loading = false, 2000)"
	>Large button</bde-button>
	</p>
`

export const enforcedSize = () => `
	<style>
	* {
    	--primary-color: #00a7e2;
    	--on-primary-color: white;
	}

	.first, .second, .third {
		display: block;
		margin-bottom: 25px;
	}

	.first {
		width: 100px;
		height: 100px;
	}

	.second {
		width: 300px;
		height: 100px;
	}

	.third {
		width: 100%;
	}
	</style>

	<bde-button class="first block">I'm a button</bde-button>
	<bde-button class="second block" icon="mdi-magnify" disabled>A second button</bde-button>
	<bde-button class="third block" loading>A last one</bde-button>
`

export const merged = () => `
	<style>
	* {
    	--primary-color: #00a7e2;
    	--on-primary-color: white;
	}
	</style>

	<p>
	<bde-button icon="mdi-github" class="merged-right medium">Login with github</bde-button><!--
	--><bde-button icon="mdi-menu-down" class="merged-left medium"></bde-button>
	</p>
	<p>
	<bde-button icon="mdi-facebook" class="merged-right medium"></bde-button><!--
	--><bde-button icon="mdi-twitter" class="merged-left merged-right medium"></bde-button><!--
	--><bde-button icon="mdi-instagram" class="merged-left medium"></bde-button>
	</p>
`