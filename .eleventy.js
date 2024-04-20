const path = require("path");
const browserslist = require("browserslist");
const { bundle, browserslistToTargets, features, composeVisitors } = require("lightningcss");
const responsiveImgs = require("./src/_plugins/responsive.images.js");

module.exports = function (eleventyConfig) {
    const now = new Date();
    process.env.TZ = "UTC";

    eleventyConfig.setTemplateFormats("md,njk,html");

    // Recognize CSS as a "template language"
    eleventyConfig.addTemplateFormats("css");

    // Process CSS with LightningCSS
    eleventyConfig.addExtension("css", {
        outputFileExtension: "css",
        compile: async function (_inputContent, inputPath) {
            let parsed = path.parse(inputPath);
            if (parsed.name.startsWith("_")) {
                return;
            }

            let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

            return async () => {
                // Switch to the `transform` function if you don't
                // plan to use `@import` to merge files
                let { code } = await bundle({
                    filename: inputPath,
                    minify: true,
                    sourceMap: false,
                    targets,
                    // Supports CSS nesting
                    // drafts: {
                    //     features.nesting,
                    // },
                });
                return code;
            };
        },
    });

    eleventyConfig.addFilter("cachebust", (url) => {
        const params = new URLSearchParams();

        try {
            params.set("v", now.getTime());
        } catch (error) {}

        return `${url}?${params}`;
    });

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
