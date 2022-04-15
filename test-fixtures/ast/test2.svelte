<script>
	let bgOpacity = 0.5;
	$: color = bgOpacity < 0.6 ? '#000' : '#fff';
	$: styleOpacity = `--opacity: ${bgOpacity};`
</script>
<p style="color: {color}; {styleOpacity}">This is a paragraph.</p>
