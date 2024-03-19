const path = require("path");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const responsiveImgs = require("./src/_plugins/responsive.images.js");

module.exports = function (eleventyConfig) {
    process.env.TZ = "UTC";

    eleventyConfig.setTemplateFormats("md,njk,html");

    //plugins
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Assets
    // eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/img");

    eleventyConfig.setServerOptions({
        watch: ["_site/*.css"]
    })

    eleventyConfig.addAsyncShortcode("image", responsiveImgs.rimage);

    // collections
    eleventyConfig.addCollection("sites", function (collectionApi) {
        return collectionApi.getFilteredByGlob("./src/sites/*.md").sort((a, b) => b.data.order - a.data.order).reverse();
    });

    return {
        dir: {input: "src", output: "_site"},
    };
};
