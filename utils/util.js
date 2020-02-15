const lexer = require('marked').lexer;
const parser = require('marked').parser;
const sanitizeHtml = require('sanitize-html');
const Option = require('../models/option').Option;

function titleToLink(title) {
  return title.trim().replace(/\s/g, '-');
}

function getDate(format) {
  if (format === undefined) format = 'yyyy-MM-dd hh:mm:ss';
  const date = new Date();
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    S: date.getMilliseconds()
  };

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return format;
}

function md2html(markdown) {
  return parser(lexer(markdown));
}

function updateConfig(config) {
  Option.all((status, message, options) => {
    if (status) {
      options.forEach(option => {
        config[option.name] = option.value;
      });
    } else {
      console.error('Unable load config from database: ', message);
    }
  });
}

module.exports = {
  titleToLink,
  getDate,
  md2html,
  updateConfig
};
