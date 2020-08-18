/*
 */
function format(size, spacing) {
	/* Set body line-height to spacing ratio. */
	if (document.querySelector('body'))
		document.querySelector('body').style.lineHeight = `${spacing}`;
	/* TODO: finish comment
	 */
    let article = 'article', quote = '.quote', author = '.author', child;
	for (let node of document.querySelectorAll(article)) {
		let count = 0, log = '';

		/* Find number of lines of author. */
		child = node.querySelector(author);
		if (child) {
			let lines = child.innerHTML.split(/\r?\n/);
			count = child.innerHTML ? lines.length : 0;
			/* Set font-size and break lines if any, else display: none. */
			if (count) {
				child.innerHTML = lines.join('<br>');
				child.style.fontSize = `${size}px`;
			}
			else
				child.style.display = 'none';
			log += `AUTHOR: "${child.innerHTML}" lines = ${count}`;
		}

		/* Find number of characters of quote and use it to set font-size. */
		child = node.querySelector(quote);
		if (child) {
			let length = child.innerHTML.length;
			log = `QUOTE: "${child.innerHTML}" length = ${length} ` + log;
			console.log(log);

			let width = node.offsetWidth * 72 / 96;
			let height = node.offsetHeight * 72 / 96 - count * size * spacing;
			let area = width * height;
			let rect = get_text_size(child.innerHTML, `${size}px "Rock Salt"`);
			let ratio = Math.sqrt(area / rect.width / rect.height / spacing);
			const fudge = 1.05;
			/* TODO: 108px is an arbitrary max */
			let fontSize = 
				`${Math.min(108, Math.round(size * ratio * fudge))}px`;
			console.log(`WIDTH: ${rect.width}; HEIGHT: ${rect.height}  `
				+ `RATIO: ${ratio} "${fontSize}"`);
			child.style.fontSize = fontSize;

			/* Set random colors from list. */
			const colors = [ '#0cc', '#63c', '#f90', '#c33', '#06c', '#393', ];
			let color = colors[Math.floor(Math.random() * colors.length)];
			node.style.color = 'white';
			node.style.backgroundColor = color;
		}
	}
	/* Set body display to make visible. */
	if (document.querySelector('body'))
		document.querySelector('body').style.visibility = `visible`;;

	return false;
}

// https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering
function get_text_size(txt, font) {
    let element = document.createElement('canvas');
    let context = element.getContext("2d");
    context.font = font;
    let tsize = {
		'width': context.measureText(txt).width, 
		'height':parseInt(context.font)
	};
    return tsize;
}
