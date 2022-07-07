<script>
	let color1 = '#f00';
	let color2 = '#0f0';
	let color3 = '#00f';
	let color4 = '#ff0';
	let value
</script>
<input class:over-100={value > 100} bind:value={value} style="color: {color1}">
<input class:over-100={  ((value > 100) )  } bind:value={value} style="color: {color2}">
<input class={ `${(value > 100) ? 'foo' : 'bar'}`  } style="color: {color3}">
<input class={ {foo: (value > 100) ? 'foo' : 'bar'}.foo  } style="color: {color4}">

<style>
input {
	color: red;
}
</style>
