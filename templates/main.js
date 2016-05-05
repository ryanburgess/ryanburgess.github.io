// Main Template
const ga = require('./ga');
const header = require('./header');
const social = require('./social');
const mainContent = require('../content/main.json');

module.exports = function main(pageType, pageTitle, pageContent) {
  'use strict';
  const mainTitle = mainContent[0].title;
  const desc = mainContent[0].desc;
  const gaCode = mainContent[0].ga;
  const about = mainContent[0].about;
  let sectionTitle;
  let path;
  let css;

  if(pageContent === undefined) {
    pageContent = '';
  }

  // homepage
  if(pageType === 'home') {
    path = '';
    pageTitle = '';
    css = 'public/css/style.css';
    sectionTitle = 'About';

    // get about content
    for (const aboutContent of about) {
      pageContent += `<p>${aboutContent}</p>`;
    }
  }

  // post page
  if(pageType === 'post') {
    path = '../../';
    css = 'public/css/post.css';
    pageTitle = title + ' - ';
  }

  return `<!DOCTYPE html>
  <html>
      <head>
          <title>${pageTitle}${mainTitle}</title>
          <meta name="description" content="${desc}">
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <link rel="icon" href="http://ryanburgess.com/favicon.ico" type="image/x-icon">
          <link rel="canonical" href="http://ryanburgess.com/">
          <link rel="stylesheet" href="${path}${css}" type="text/css" media="screen">
          ${ga(`${gaCode}`)}
      </head>
      <body>
          ${header(path, mainTitle)}
          <div class="container row">
            <h2>${sectionTitle}</h2>
            <div class="content">
              ${social()}
              ${pageContent}
            </div>
          </div>
      </body>
  </html>`;
};