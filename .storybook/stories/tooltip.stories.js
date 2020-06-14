export default {title:"tooltip"}

import "@index/components/tooltip"

export const onHover = () => `
<style>
* {
	--primary-color: #00a7e2;
	--on-primary-color: white;
}
* {
    --secondary-color: #ff005d;
    --on-secondary-color: white;
}
</style>

<p>
	<bde-tooltip
		content="Des opinions de gauche"
		anchor="right"
		flavor="secondary">
		<button>A gauche</button>
	</bde-tooltip>
	<bde-tooltip
		content="Une bien belle tooltip sur un bouton des plus agréables"
		achor="center">
		<button>Hey Apple !</button>
	</bde-tooltip>
	<bde-tooltip
		content="Des opinions de droite"
		anchor="left"
		flavor="primary">
		<button>A droite</button>
	</bde-tooltip>
</p>

<style>
	p {
		margin-top: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	bde-tooltip {
		display: inline-block;
	}
</style>
`

export const shownOnEvent = () => `
<p>
	<bde-tooltip
		content="Vous êtes une personne de goût !"
		anchor="left"
		noHover>
		<input
			type="checkbox"
			id="likeSushi"
			onchange="this.parentElement.show = this.checked"
		/><label for="likeSushi">Do you like sushi ?</label>
	</bde-tooltip>
</p>

<style>
	p {
		margin-top: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	bde-tooltip {
		display: inline-block;
	}
</style>
`

export const showAtLoading = () => `
<p>
	<bde-tooltip
		content="Cliquez sur moi !"0
		show>
		<button>Hello world</button>
	</bde-tooltip>
	<bde-tooltip
		content="Cette tooltip s'autodétruira"
		noHover
		show>
		<button>Mr Bond ?</button>
	</bde-tooltip>
</p>

<style>
	p {
		margin-top: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	bde-tooltip {
		display: inline-block;
		margin-right: 100px;
	}
</style>
`