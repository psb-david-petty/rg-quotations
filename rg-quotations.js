/* rg-quotations is a webpage system based on a classroom poster 
 * by Ria Galanos consisting of quotations in computing.
 */
const color_map = {
    red: '#c33', 
    green: '#393',
    blue: '#06c', 
    purple: '#63c', 
    orange: '#f90', 
    cyan: '#0cc', 
};

/* Format takes default font-size and line-height spacing and adjusts the
 * font-size for the quotation to (mostly) fit in each article.
 *
 * A sample <article> is:
 *    <article>
 *      <p class="quote">There’s always one more bug.</p>
 *      <p class="author">- Lubarshky’s Law of Cybernetic Entomology</p>
 *    </article>
 */
function format(size, spacing) {
    /* Set body line-height to spacing ratio. */
    if (document.querySelector('body'))
        document.querySelector('body').style.lineHeight = `${spacing}`;
                                                /* */
    /* Examine each article to look for author and quote. Find number (zero
     * or more) lines in author (to adjust size of available height). Measure
     * area of text at size and scale quote font-size to fill available area.
     * Randomly shuffle available colors and set article background-color.
     */
    let colors = Object.values(color_map);      /* initialize colors */
    let article = 'article', quote = '.quote', author = '.author', child, log;
    for (const [index, node] of document.querySelectorAll(article).entries()) {
        /* Rearrange color array after all are used. */
        if (index % colors.length == 0) {
            colors = shuffle(colors);
        }

        /* Find number of lines of author. */
        let count = 0;
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
            log = `AUTHOR: "${child.innerHTML}" lines = ${count}; `;
        }

        /* Find number of characters of quote and use it to set font-size. */
        child = node.querySelector(quote);
        if (child) {
            let length = child.innerHTML.length;
            log = `QUOTE: "${child.innerHTML}" length = ${length}; ` + log;

            /* There is a lot going on here...
             * - adjust node width & height by 3/4 - actual DPI v. canvas DPI
             * - use text width & height @ size to calculate ratio
             * - include a fudge factor, because areas of wrapped text differ
             * - set font-size to scaled value, clipped to a maximum
             */
            let width = node.offsetWidth * 72 / 96;
            let height = node.offsetHeight * 72 / 96 - count * size * spacing;
            let area = width * height;
            /* TODO: assumes "Rock Salt" font */
            let rect = get_text_size(child.innerHTML, `${size}px "Rock Salt"`);
            let ratio = Math.sqrt(area / rect.width / rect.height / spacing);
            const fudge = 1.05;
            /* TODO: 108px is an arbitrary max */
            let fontSize = 
                `${Math.min(108, Math.round(size * ratio * fudge))}px`;
            log += `WIDTH: ${rect.width}; HEIGHT: ${rect.height}  `
                + `RATIO: ${ratio} "${fontSize}"; `;
            child.style.fontSize = fontSize;

            /* Set random colors from shuffled list. */
            let color = colors[index % colors.length];
            node.style.color = 'white';
            node.style.backgroundColor = color;
            log += `COLOR: ${color}; `;

            console.log(log);
        }
    }
    /* Set specific colors with colorize. */
    colorize(color_map);

    /* Set body display to make visible. */
    if (document.querySelector('body'))
        document.querySelector('body').style.visibility = `visible`;

    return false;
}

/* Colorize particular elements based on classes in keys of the colors object.
 */
function colorize(colors) {
    for (const color in colors) {
        // Select all nodes matching color class and set background-color.
        for (const node of document.querySelectorAll(`.${color}`)) {
            node.style.backgroundColor = colors[color];
        }
    }
    return false;
}

// https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering
function get_text_size(txt, font) {
    let element = document.createElement('canvas');
    let context = element.getContext('2d');
    context.font = font;
    let tsize = {
        'width': context.measureText(txt).width, 
        'height': parseInt(context.font)
    };
    return tsize;
}

/* https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) 
 * Shuffle. See https://github.com/coolaj86/knuth-shuffle.
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
