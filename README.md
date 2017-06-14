# Generate AMP's

When you have to make AMP templates regularly you can use this module. It generates HTML pages from a src/pages directory (important you put everything in a src dir!)

```json
// package.json
{
    ...
    "scripts": {
        "dev": "generate-amp -s ./src/pages -o ./build",
        "build": "generate-amp -s ./src/pages -o ./dist -p"
    },
    ...
}
```
## available options

'--help' - explanation
'-s' - source directory for pages (must be in a subdir, not in your project root)
'-o' - output folder
'-v' - more verbose

## Directory structure
```
src/
    pages/
        index/
            data.js
            style.styl
            template.tpl
    components/
        layout.tpl
        navigation.tpl
    styles/
        variables.styl
```

## Data file (plain js)
```js
module.exports = {
    name: 'page-name',
    ...props // Everything you declare here will be available in you template
}
```

## .tpl file (nunjucks)
```
{% extends '../../components/layout.tpl' %}

{% block content %}
    Write something!
{% endblock%}
```

## .styl file (stylus)
```styl
$color-primary = #ffffff

.main
    display: flex
```