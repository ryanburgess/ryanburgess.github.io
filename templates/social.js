// Main Template
const mainContent = require('../content/main.json');

module.exports = function social() {
  'use strict';
  const social = mainContent[0].social;
  let content = '';

  for (const socialLinks of social) {
    content += `<li><a href="${socialLinks.url}" class="${socialLinks.class}">${socialLinks.title}</a></li>`;
  }

  return `<ul class="social">
            ${content}
          </ul>`;
};