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
 * font-size for the quotation to (mostly) fit in each section.
 *
 * A sample <section> is:
 *    <section>
 *      <article>
 *        <p class="quote">There’s always one more bug.</p>
 *      </article>
 *      <article>
 *        <p class="author">- Lubarshky’s Law of Cybernetic Entomology</p>
 *      </article>
 *    </section>
 */
function format(size, spacing) {
    /* Set body line-height to spacing ratio. */
    if (document.querySelector('body'))
        document.querySelector('body').style.lineHeight = `${spacing}`;
                                                /* */
    /* Examine each section to look for author and quote. Find number (zero
     * or more) author lines (to adjust size of available height). Find
     * areas of quote lines of text at size, sum them to calculate scale, 
     * and adjust font-size of quote lines to fill available area.
     * Randomly shuffle available colors and set section background-color.
     * colorize elements based on color class attribute (if any).
     *
     * NOTE: use child.innerHTML.split(/\r?\n/); to split multiple lines
     */
    let colors = Object.values(color_map);      /* initialize colors */
    const section = 'section', quote = '.quote', author = '.author';
    for (const [index, node] of document.querySelectorAll(section).entries()) {
        /* Rearrange color array after all are used once. */
        if (index % colors.length == 0) {
            colors = shuffle(colors);
        }

        /* Find number of author lines. */
        let lines = Array(), count = 0, log = ''
        for (const child of node.querySelectorAll(author)) {
            count += 1;                         /* increment child count */
            child.style.fontSize = `${size}px`; /* set child font-size */
            lines.push(child.innerHTML);
        }
        log += `AUTHOR: "${lines.join('+')}"(${count}); `;
        lines = Array();

        /* Find quote rectangles and acumulate area @ size. */
        let rects = Array(), area = 0;
        for (const child of node.querySelectorAll(quote)) {
            /* TODO: assumes "Rock Salt" font */
            let rect = get_text_size(child.innerHTML,`${size}px "Rock Salt"`);
            area += rect.width * rect.height * spacing;
            lines.push(`"${child.innerHTML}"(${child.innerHTML.length})`
                + `[${Math.round(rect.width)}x${rect.height}]`);
        }
        log = `QUOTE: ${lines.join('+')}; ` + log;

        /* There is a lot going on here...
         * - adjust node width & height by 3/4 - actual DPI v. canvas DPI
         * - use text area to calculate ratio
         * - include a fudge factor, because areas of wrapped text differ
         * - scale fontSize, clipped to a maximum
         */
        let width = node.offsetWidth * 72 / 96;
        let height = node.offsetHeight * 72 / 96 - count * size * spacing;
        let ratio = Math.sqrt(width * height / area);
        const fudge = 1.05;
        /* TODO: 120px is an arbitrary max */
        let fontSize = 
            `${Math.min(120, Math.round(size * ratio * fudge))}px`;
        log += `RATIO: ${ratio.toFixed(3)} "${fontSize}"; `;

        /* Set font-size of quotes to scaled value clipped to a maximum. */
        for (const child of node.querySelectorAll(quote)) {
            child.style.fontSize = fontSize;
        }

        /* Set random colors from shuffled list. */
        let color = colors[index % colors.length];
        node.style.color = 'white';
        node.style.backgroundColor = color;
        log += `COLOR: ${color}; `;

        console.log(log);
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

/* https://stackoverflow.com/questions/31305071/measuring-text-width-height-without-rendering
 * Return rectangle object w/ width and height of txt rendered in font.
 */
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
