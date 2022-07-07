<script>
	let color = '#f00';
	let value
</script>
<input class:over-100={value > 100} bind:value={value} style="color: {color}">
<input class:over-100={  ((value > 100) )  } bind:value={value} style="color: {color}">


<style>
input {
	color: red;
}
</style>
