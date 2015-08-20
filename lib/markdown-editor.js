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

MarkdownEditor.prototype.ready = function () {
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
  if (window.MARKDOWN_EDITOR_DISABLE_AUTO_LOAD_STYLE) {
    return;
  }
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.media = 'all';
  elem.href = (window.MARKDOWN_EDITOR_FLAVORED_STYLE_PATH || '') + 'markdown-editor.css';
  return elem;
}

MarkdownEditor.prototype.ontabclick = function (e) {
  var name = e.target.innerText.toLowerCase();
  currentTab = name;
  return this.rendertab();
};