<script>
	let bgOpacity = 0.5;
	$: color = bgOpacity < 0.6 ? '#000' : '#fff';
</script>
<p style="color: {color}; --opacity: {bgOpacity};">This is a paragraph.</p>
<p style="color: {color}">This is a paragraph.</p>
