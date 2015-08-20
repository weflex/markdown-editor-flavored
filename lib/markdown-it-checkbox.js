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