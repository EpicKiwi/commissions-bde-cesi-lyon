import "@index/components/loading.js"

export default {title: "Loading"}

export const sizeAgnostic = () => `
<style>
	.wrapper {
		border: solid 1px black;
		margin-bottom: 50px;
	}
	.small {
		width: 100px;
		height: 100px;
	}
	.medium {
		width: 200px;
		height: 200px;
	}
	.large {
		width: 300px;
		height: 100px;
	}
</style>

<div class="wrapper small">
	<bde-loading></bde-loading>
</div>

<div class="wrapper medium">
	<bde-loading></bde-loading>
</div>

<div class="wrapper large">
	<bde-loading></bde-loading>
</div>
`

export const definedSize = () => `
<style>
	.all {
		display: flex;
		flex-direction: row;
	}
	.wrapper {
		border: solid 1px black;
		margin-right: 50px;
		width: 100px;
		height: 100px;
	}
</style>

<div class="all">

	<div class="wrapper">
		<bde-loading></bde-loading>
	</div>

	<div class="wrapper">
		<bde-loading size="25px"></bde-loading>
	</div>

	<div class="wrapper">
		<bde-loading size="50px"></bde-loading>
	</div>

</div>
`