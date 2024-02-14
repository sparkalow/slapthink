const path = require("path");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");


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

    return {
        dir: {input: "src", output: "_site"},
    };
};
