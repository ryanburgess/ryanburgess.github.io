// Header
module.exports = function header(path, title) {
  'use strict';

  if(path === undefined) {
    path = '';
  }

  const template = `<header class="row">
            <a href="/"><h1>${title}</h1></a>
        </header>`;

  return template;
};