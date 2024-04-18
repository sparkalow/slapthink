const path = require("path");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const responsiveImgs = require("./src/_plugins/responsive.images.js");

module.exports = function (eleventyConfig) {
    const now = new Date();
    process.env.TZ = "UTC";

    eleventyConfig.setTemplateFormats("md,njk,html");

    eleventyConfig.addFilter("cachebust", (url) => {
        const params = new URLSearchParams();

        try {
            params.set("v", now.getTime());
        } catch (error) {}

        return `${url}?${params}`;
    });

    //plugins
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Assets
    // eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy({ "src/public": "/" });

    eleventyConfig.setServerOptions({
        watch: ["_site/*.css"],
    });

    eleventyConfig.addAsyncShortcode("image", responsiveImgs.rimage);

    // collections
    eleventyConfig.addCollection("sites", function (collectionApi) {
        return collectionApi
            .getFilteredByGlob("./src/sites/*.md")
            .sort((a, b) => b.data.order - a.data.order)
            .reverse();
    });

    return {
        dir: { input: "src", output: "_site" },
    };
};
