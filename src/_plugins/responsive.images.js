/**
 *
 */
const Image = require("@11ty/eleventy-img");
const path = require("path");
const urlPath = "/media/img"; //images url
const outputDir = "_site/media/img/."; //images storage dir
var imageDataCache = {}; // image data cache

/**
 * Output a responsive image with created sizes and markup
 * @param imgSrc
 * @param widths array of widths
 * @param attributes object of img and picture element attributes
 * @returns {Promise<string>}
 *  example usage   {% image jumbotron.img, [800,1000], { img: { sizes:"(min-width: 1024px) 800px, 100vw", alt: "", class: "w-full object-cover"}, picture: { class:"clipped-img" } } %}
 */
const rimage = async function (imgSrc, widths = ['auto'], attributes = {img: {}, picture: {}}) {

    try {
        if (!imgSrc) {
            logWarning(`responsiveImg missing imgSrc \n${this.page.inputPath} : ${this.page.outputPath} ` + JSON.stringify(attributes))
            return "";
        }
        if (attributes && attributes.img && attributes.img.alt === undefined) {
            logWarning(`responsiveImg ${imgSrc} missing alt  ${this.page.inputPath} : ${this.page.outputPath}`);
            attributes.img.alt = " ";
        }
        //convert to filesystem path
        const src = "./src/" + imgSrc;

        let imgData = await Image(src, {
            widths: widths,
            formats: ["webp", "jpeg"],
            urlPath: urlPath,
            outputDir: outputDir,
            filenameFormat: filenameFormat
        });
        let imageAttributes = Object.assign(
            {
                alt: "",
                "class": 'w-full object-cover',
                width: imgData.jpeg["0"].width,
                height: imgData.jpeg["0"].height,
                src: imgData.jpeg["0"].url,
                sizes: "100vw",
                loading: "lazy",
                decoding: "async"
            },
            attributes.img
        );

        const imgAttributesString = buildAttributes(imageAttributes);
        let html = Image.generateHTML(imgData, imageAttributes);
        if (attributes.picture && Object.keys(attributes.picture).length) {
            const pictureAttrString = buildAttributes(attributes.picture);
            html = html.replace('<picture>', `<picture ${pictureAttrString}>`);
        }
        return html
    } catch (error) {
        // logError("responsiveImg " + imgSrc, error);
        logError(`responsiveImg    ${this.page.inputPath} : ${this.page.outputPath} \n ${error.message}`);
    }
}


const buildAttributes = function (obj) {
    let attrs = [];
    for (const [key, value] of Object.entries(obj)) {
        attrs.push(`${key}="${value}"`);
    }
    return attrs.join(' ');
}

/**
 * Format filename to contain width instead of hash
 * @param id
 * @param src
 * @param width
 * @param format
 * @param options
 * @returns {string}
 */
function filenameFormat(id, src, width, format, options) {
    const extension = path.extname(src);
    const name = path.basename(src, extension);
    return `${name}-${width}w.${format}`;
}

const logError = function (msg, error) {
    console.log();
    console.log("🛑  !!! Error:", msg);
    if (error) {
        console.log(error);
    }
};
const logWarning = function (msg) {
    console.log("🟡    warning:", msg);
};

module.exports = {
    rimage: rimage
};
