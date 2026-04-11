module.exports = function(eleventyConfig) {
  // Pass static assets through untouched
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("favicon");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin");

  // Security filter: prevent XSS in JSON injected into <script> blocks
  // Escapes </ to prevent closing script tags in string content
  eleventyConfig.addFilter("jsonSafe", function(value) {
    return JSON.stringify(value).replace(/<\//g, "<\\/");
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
