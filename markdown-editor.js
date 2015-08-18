
(function (exports) {

  var defaultWidth = '500px';
  var currentTab = 'write';
  var styleImported = false;
  var style = createStyle();

  function MarkdownEditor (selector) {
    if (!(this instanceof MarkdownEditor)) {
      return new MarkdownEditor(selector);
    }
    this.element = document.querySelector(selector);
    this.content = this.element.innerText;
    this.ready();
    return this;
  }

  MarkdownEditor.prototype.ready = function () {
    this.hide();
    if (!styleImported && exports.MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE) {
      this.style = style;
      document.head.appendChild(this.style);
      styleImported = true;
    }
    this.element.classList.add('markdown-editor');
    this.md = new markdownit().use(checkbox)
    return this;
  };

  MarkdownEditor.prototype.hide = function () {
    this.element.style.display = 'none';
    return this;
  };

  MarkdownEditor.prototype.show = function () {
    this.element.style.display = 'inline-block';
    return this;
  };

  MarkdownEditor.prototype.rendertab = function () {
    this.tabs.write.classList.remove('selected');
    this.tabs.preview.classList.remove('selected');
    this.tabs[currentTab].classList.add('selected');
    this.contents.write.style.display = 'none';
    this.contents.preview.style.display = 'none';
    this.contents[currentTab].style.display = null;

    if (currentTab === 'preview') {
      var src = this.contents.write.querySelector('textarea').value;
      this.contents.preview.innerHTML = this.md.render(src);
    }
    return this;
  };

  MarkdownEditor.prototype.switchtab = function (n) {
    currentTab = n;
    this.rendertab();
  };

  MarkdownEditor.prototype.render = function (width) {
    this.element.style.width = width || defaultWidth;
    this.element.innerHTML = ''+
      '<div class="head tabnav">'+
        '<div class="pull-right">'+
          // '<a class="tabnav-extra" href="https://guides.github.com/features/mastering-markdown/">'+
          //   '<span class="octicon octicon-markdown"></span>'+
          //   'Markdown Supported'+
          // '</a>'+
        '</div>'+
        '<nav class="tabnav-tabs">'+
          '<a href="#" class="tabnav-tab write-tab selected">Write</a>'+
          '<a href="#" class="tabnav-tab preview-tab">Preview</a>'+
        '</nav>'+
      '</div>'+
      '<div class="write-content">'+
        '<textarea placeholder="leave a comment"></textarea>'+
      '</div>'+
      '<div class="preview-content">'+
        '<a>Nothing to preview</a>'+
      '</div>'+
    '';

    this.tabs = {
      'write': this.element.querySelector('.write-tab'),
      'preview': this.element.querySelector('.preview-tab')
    };
    this.contents = {
      'write': this.element.querySelector('.write-content'),
      'preview': this.element.querySelector('.preview-content')
    };

    var ontabclick = this.ontabclick.bind(this);
    this.tabs.write.addEventListener('click', ontabclick);
    this.tabs.preview.addEventListener('click', ontabclick);
    return this.rendertab().show();
  };

  function createStyle () {
    if (exports.MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE) {
      return;
    }
    var elem = document.createElement('link');
    elem.rel = 'stylesheet';
    elem.media = 'all';
    elem.href = (exports.MARKDOWN_EDITOR_FLAVORED_STYLE_PATH || '') + 'markdown-editor.css';
    return elem;
  }

  MarkdownEditor.prototype.ontabclick = function (e) {
    var name = e.target.innerText.toLowerCase();
    currentTab = name;
    return this.rendertab();
  };

  /**
   * Markdown checkbox
   */
  function checkboxReplace (md) {
    var arrayReplaceAt = md.utils.arrayReplaceAt;
    var lastId = 0;
    var options = { 'dirWrap': false };
    var pattern = /\[(X|\s|\_|\-)\]\s(.*)/i;
    var splitTextToken;

    function splitTextToken(original, Token) {
      var checked, id, label, matches, nodes, ref, text, token, value;
      text = original.content;
      nodes = [];
      matches = text.match(pattern);
      value = matches[1];
      label = matches[2];
      checked = (ref = value === 'X' || value === 'x') != null ? ref : {
        'true': false
      };

      /**
       * <div class="checkbox">
       */
      if (options.divWrap) {
        token = new Token('checkbox_open', 'div', 1);
        token.attrs = [['class', 'checkbox']];
        nodes.push(token);
      }

      /**
       * <input type='checkbox' id='checkbox{n}' checked='true'>
       */
      id = 'checkbox' + lastId;
      lastId += 1;
      token = new Token('checkbox_input', 'input', 0);
      token.attrs = [['type', 'checkbox'], ['id', id]];
      if (checked === true) {
        token.attrs.push(['checked', 'true']);
      }
      nodes.push(token);

      /**
       * <label for="checkbox{n}">
       */
      token = new Token('label_open', 'label', 1);
      token.attrs = [['for', id]];
      nodes.push(token);

      /**
       * content of label tag
       */
      token = new Token('text', '', 0);
      token.content = label;
      nodes.push(token);

      /**
       * closing tags
       */
      nodes.push(new Token('label_close', 'label', -1));
      if (options.div_wrap) {
        nodes.push(new Token('checkbox_close', 'div', -1));
      }
      return nodes;
    };

    return function(state) {
      var blockTokens, i, j, l, token, tokens;
      blockTokens = state.tokens;
      j = 0;
      l = blockTokens.length;
      while (j < l) {
        if (blockTokens[j].type !== 'inline') {
          j++;
          continue;
        }
        tokens = blockTokens[j].children;
        i = tokens.length - 1;
        while (i >= 0) {
          token = tokens[i];
          if (token.type === 'text' && pattern.test(token.content)) {
            blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, splitTextToken(token, state.Token));
          }
          i--;
        }
        j++;
      }
    };
  };

  function checkbox (md) {
    md.core.ruler.push('checkbox', checkboxReplace(md));
  }

  exports.MarkdownEditor = MarkdownEditor;

})(window);
