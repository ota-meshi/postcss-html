# PostCSS HTML Syntax

[![NPM license](https://img.shields.io/npm/l/postcss-html.svg)](https://www.npmjs.com/package/postcss-html)
[![NPM version](https://img.shields.io/npm/v/postcss-html.svg?style=flat-square)](https://www.npmjs.com/package/postcss-html)
[![NPM downloads](https://img.shields.io/npm/dw/postcss-html.svg)](http://www.npmtrends.com/postcss-html)
[![NPM downloads](https://img.shields.io/npm/dm/postcss-html.svg)](http://www.npmtrends.com/postcss-html)
[![NPM downloads](https://img.shields.io/npm/dy/postcss-html.svg)](http://www.npmtrends.com/postcss-html)
[![Build Status](https://github.com/ota-meshi/postcss-html/workflows/CI/badge.svg?branch=master)](https://github.com/ota-meshi/postcss-html/actions?query=workflow%3ACI)

<img align="right" width="95" height="95"
 title="Philosopher’s stone, logo of PostCSS"
 src="http://postcss.github.io/postcss/logo.svg">

[PostCSS](https://github.com/postcss/postcss) syntax for parsing HTML (and HTML-like)

- [Vue Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html)
- [Svelte Components](https://svelte.dev/docs#component-format)
- [Astro Components](https://docs.astro.build/en/core-concepts/astro-components/)
- [PHP](http://php.net)
- [Quick App](https://doc.quickapp.cn/framework/source-file.html)
- [XSLT](https://www.w3.org/TR/xslt-30/)

## Getting Started

First thing's first, install the module:

```bash
npm install postcss-html --save-dev
```

postcss-html is an ES module and requires Node.js `^22.12 || >=24`. CommonJS consumers on those Node.js versions can still load it with `require("postcss-html")`.

If you want support SCSS/SASS/LESS/SugarSS syntax, you need to install the corresponding module.

- SCSS: [postcss-scss](https://github.com/postcss/postcss-scss)
- SASS: [postcss-sass](https://github.com/aleshaoleg/postcss-sass)
- LESS: [postcss-less](https://github.com/shellscape/postcss-less)
- SugarSS: [sugarss](https://github.com/postcss/sugarss)
- Stylus: [postcss-styl](https://github.com/ota-meshi/postcss-styl)

## Use Cases

```js
import postcss from 'postcss';
import postcssHtml from 'postcss-html';
import postcssScss from 'postcss-scss';
import postcssLess from 'postcss-less';
import postcssSafeParser from 'postcss-safe-parser';

const syntax = postcssHtml({
    // syntax for parse scss (non-required options)
    scss: postcssScss,
    // syntax for parse less (non-required options)
    less: postcssLess,
    // syntax for parse css blocks (non-required options)
    css: postcssSafeParser,
});
postcss(plugins).process(source, { syntax: syntax }).then(function (result) {
    // An alias for the result.css property. Use it with syntaxes that generate non-CSS output.
    result.content
});
```

If you want support SCSS/SASS/LESS/SugarSS syntax, you need to install these module:

- SCSS: [postcss-scss](https://github.com/postcss/postcss-scss)
- SASS: [postcss-sass](https://github.com/aleshaoleg/postcss-sass)
- LESS: [postcss-less](https://github.com/shellscape/postcss-less)
- SugarSS: [sugarss](https://github.com/postcss/sugarss)
- Stylus: [postcss-styl](https://github.com/ota-meshi/postcss-styl)

## Advanced Use Cases

### Options

```js
import postcssHtml from 'postcss-html';
import postcssSass from 'postcss-sass';
import sugarss from 'sugarss';
import postcssCustomSyntax from 'postcss-custom-syntax';

const options = {
    rules: [
        {
            // custom language
            test: /^postcss$/i,
            lang: 'scss'
        },
        {
            // custom language
            test: /^customcss$/i,
            lang: 'custom'
        },
    ],

    // custom parser for CSS (using `postcss-safe-parser`)
    css: 'postcss-safe-parser',
    // custom parser for SASS (PostCSS-compatible syntax.)
    sass: postcssSass,
    // custom parser for SCSS (by module name)
    scss: 'postcss-scss',
    // custom parser for LESS (by module path)
    less: './node_modules/postcss-less',
    // custom parser for SugarSS
    sugarss: sugarss,
    // custom parser for custom language
    custom: postcssCustomSyntax,
}
const syntax = postcssHtml(options);
```

## Turning PostCSS off from within your HTML

PostCSS can be temporarily turned off by using special comments in your HTML. For example:

```html
<html>
<body>
<!-- postcss-ignore -->
<a style="color: red;" description="style is not parsed."></a>

<a style="color: red;" description="style is parsed."></a>
```

```html
<html>
<body>
<!-- postcss-disable -->
<a style="color: red;" description="style is not parsed."></a>
<a style="color: red;" description="style is not parsed."></a>
<!-- postcss-enable -->

<a style="color: red;" description="style is parsed."></a>
```

## Linting with Stylelint

The main use case of this plugin is to apply linting with [Stylelint] to `<style>` tags and `<div style="*">` property in HTML (and HTML-like).

You can use it by configuring your `stylelint` config as follows:

```json
{
    "overrides": [
        {
            "files": ["*.html", "**/*.html"],
            "customSyntax": "postcss-html"
        }
    ]
}
```

You can use it more easily if you use an already configured sharable config.

```diff
{
+    "extends": [
+        "stylelint-config-html",
         // If you are using Vue.
+        "stylelint-config-recommended-vue"
+    ],
-    "overrides": [
-        {
-            "files": ["*.html", "**/*.html"],
-            "customSyntax": "postcss-html"
-        }
-    ]
}
```

- [stylelint-config-html]
- [stylelint-config-recommended-vue]

[Stylelint]: https://stylelint.io/
[stylelint-config-html]: https://github.com/ota-meshi/stylelint-config-html
[stylelint-config-recommended-vue]: https://github.com/ota-meshi/stylelint-config-recommended-vue
