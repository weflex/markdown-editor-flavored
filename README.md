
Markdown Editor
------------------------

A markdown editor integrate `write` and `preview` tabs like Github's flavored editor.

![Preview UI](resource/ui.png)
![Preview UI-List](resource/ui-list.png)

### Live Demo

[Markdown-Editor Demo](http://yorkie.ninja/markdown-editor-flavored/)

### Usage

Define your `div` element as the editor replacement.

```html
<div id="markdown-editor-sample"></div>
```

And write JavaScript:

```js
var editor = new MarkdownEditor('#markdown-editor-sample');
editor.render();
```

You can specify the width of editor by calling the `.render` function with an argument like:

```js
editor.render('auto');
// or
editor.render('500px');
```

### Environment Variables

`MARKDOWN_EDITOR_FLAVORED_STYLE_PATH`: to change the root path to search style, the usage:

```js
window.MARKDOWN_EDITOR_FLAVORED_STYLE_PATH = 'your_root_dir';
```

`MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE`: to disable the auto load of styles(`markdown-editor.css`), the usage:

```js
window.MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE = true;
```

(This is used for some custom tools to load the style in their working group, like `concat`).

### Install

```sh
$ npm install markdown-editor
$ bower install markdown-editor
```

### License

MIT
