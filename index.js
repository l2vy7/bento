module.exports.lint = function (code) {
  let tokens = Array.from(code);

  var full = true;

  var errors = [];

  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] === '[') {
      var enclosed = false;
      if (tokens[i + 1] === '[') {
        full = false;
        enclosed = false;
        errors.push(i.toString() + ' (' + tokens[i] + ') ' + ': Embedded loop from start.');
        break;
      }
      for (var token of tokens.slice(i + 1, tokens.length)) {
        if (enclosed === null) break;
        if (token === '[') {
          full = false;
          enclosed = false;
          errors.push(i.toString() + ' (' + tokens[i] + ') ' + ': Unenclosed loop from start.');
          break;
        } else if (token === ']') {
          var ctok = tokens.slice(i + 1, tokens.length);
          if (ctok[ctok.indexOf(token) + 1] === ']') {
            full = false;
            enclosed = false;
            errors.push((i + ctok.indexOf(token)).toString() + ' (' + token + ') ' + ': Embedded loop from end.');
            break;
          }
          enclosed = true;
          break;
        }
      }
      if (!enclosed)
        full = false;
        break;
    } else if (tokens[i] === ']') {
      var enclosed = false;
      if (tokens[i - 1] === ']') {
        full = false;
        enclosed = false;
        errors.push(i.toString() + ' (' + tokens[i] + ') ' + ': Embedded loop from end.');
        break;
      }
      for (var token of tokens.slice(0, i - 1)) {
        if (!full) break;
        if (token === ']') {
          full = false;
          enclosed = false;
          errors.push(i.toString() + ' (' + tokens[i] + ') ' + ': Unenclosed loop from end.');
          break;
        } else if (token === '[') {
          var ctok = tokens.slice(0, i - 1);
          if (ctok[ctok.indexOf(token) - 1] === '[') {
            full = false;
            enclosed = false;
            errors.push((i + ctok.indexOf(token)).toString() + ' (' + token + ') ' + ': Embedded loop from start.');
            break;
          }
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
