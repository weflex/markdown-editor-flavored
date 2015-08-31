var currentTab = 'write';
var styleImported = false;
var style = createStyle();

/**
 * @class MarkdownEditor
 * @constructor
 * @param {String} selector - the selector to find container
 * @param {Object} styles - the styles would be applied to container
 */
function MarkdownEditor (selector, styles) {
  if (!(this instanceof MarkdownEditor)) {
    return new MarkdownEditor(selector);
  }
  
  /**
   * @property {Element} element - the root element
   */
  this.element = document.querySelector(selector);
  
  /**
   * @property {String} content - the content
   */
  this.content = this.element.innerText;
  
  /**
   * @property {Style} style - the style attached to page
   */
  this.style = null;
  
  /**
   * @property {Object} tabs - the tabs to store
   */
  this.tabs = null;
  
  /**
   * @property {Object} contents - the contents to generate
   */
  this.contents = null;

  // ready the instance
  this._ready();

  // apply the styles
  if (styles) {
    for (var name in styles) {
      this.element.style[name] = styles[name];
    }
  }
  return this;
}

function highlighter (str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (__) {
      // Nothing
    }
  }
  try {
    return hljs.highlightAuto(str).value;
  } catch (__) {
    // Nothing
  }
  return '';
}

/**
 * `READY` method
 *
 * @method _ready
 * @private
 * @return {MarkdownEditor} this
 */
MarkdownEditor.prototype._ready = function () {
  this.hide();
  if (!styleImported && window.MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE) {
    this.style = style;
    document.head.appendChild(this.style);
    styleImported = true;
  }
  this.element.classList.add('markdown-editor');
  this.md = new markdownit({'highlight': highlighter}).use(checkbox);
  return this;
};

/**
 * hide the target
 *
 * @method hide
 * @return {MarkdownEditor} this
 */
MarkdownEditor.prototype.hide = function () {
  this.element.style.display = 'none';
  return this;
};

/**
 * show the target
 *
 * @method show
 * @return {MarkdownEditor} this
 */
MarkdownEditor.prototype.show = function () {
  this.element.style.display = 'inline-block';
  return this;
};

/**
 * render the current tab
 *
 * @method _rendertab
 * @private
 * @return {MarkdownEditor} this
 */
MarkdownEditor.prototype._rendertab = function () {
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

/**
 * switch to the specified tab
 *
 * @method switchtab
 * @param {String} n - the name of tab
 * @return {MarkdownEditor} this
 */
MarkdownEditor.prototype.switchtab = function (n) {
  currentTab = n;
  this._rendertab();
};

/**
 * render the target
 *
 * @method render
 * @return {MarkdownEditor} this
 */
MarkdownEditor.prototype.render = function () {
  this.element.innerHTML = ''+
    '<div class="head tabnav">'+
      '<div class="pull-right">'+
      '</div>'+
      '<nav class="tabnav-tabs">'+
        '<a href="#" class="tabnav-tab write-tab selected">Write</a>'+
        '<a href="#" class="tabnav-tab preview-tab">Preview</a>'+
      '</nav>'+
    '</div>'+
    '<div class="write-content">'+
      '<textarea placeholder="leave a comment">'+
        this.content+
      '</textarea>'+
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

  var ontabclick = this._ontabclick.bind(this);
  this.tabs.write.addEventListener('click', ontabclick);
  this.tabs.preview.addEventListener('click', ontabclick);
  return this._rendertab().show();
};

function createStyle () {
  if (window.MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE) {
    return;
  }
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.media = 'all';
  elem.href = (window.MARKDOWN_EDITOR_FLAVORED_STYLE_PATH || '') + 'markdown-editor.css';
  return elem;
}

/**
 * switch to the specified tab
 *
 * @method _ontabclick
 * @private
 * @param {Event} e - the event object
 */
MarkdownEditor.prototype._ontabclick = function (e) {
  var name = e.target.innerText.toLowerCase();
  currentTab = name;
  return this._rendertab();
};
