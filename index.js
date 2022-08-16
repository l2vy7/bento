module.exports.lint = function (code) {
  let tokens = Array.from(code);

  var full = true;

  var errors = [];

  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] === '[') {
      var enclosed = false;
      for (var token of tokens.slice(i + 1, tokens.length)) {
        if (enclosed === null) break;
        if (token === ']') {
          enclosed = true;
          break;
        }
      }
      if (!enclosed)
        full = false;
        break;
    } else if (tokens[i] === ']') {
      var enclosed = false;
      for (var token of tokens.slice(0, i - 1)) {
        if (!full) break;
        if (token === '[') {
          enclosed = true;
          break;
        }
      }
      if (!enclosed)
        full = false;
      break;
    }
  }

  return [full, errors];
}
