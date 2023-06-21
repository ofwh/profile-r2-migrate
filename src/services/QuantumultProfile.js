import path from 'node:path';
import ProfileBase from './ProfileBase.js';

// 一些结束符会导致url截取有问题，可能存在一些颜文字等特殊字符的域名或者路径参数，慢慢调整吧
const regUrl = /http(s)?:\/\/([^,\s\$#'"`\{\}\[\]\(\)]*)/g;

export default class QuantumultProfile extends ProfileBase {
  recursive = true;

  constructor(options = {}) {
    super(options);

    // QX是通过正则匹配链接来处理的
    this.match = options.match;
    this.extensions = options.extensions || [];
  }

  filterAssets(body) {
    const { match, extensions } = this;
    // 匹配所有url链接，然后走白名单进行替换
    const matches = body
      .replace(/^(\s+)?(#|;)(.*)?/gm, '') // 替换掉 # 和 ; 开头的注视内容 (yaml文件)
      .replace(/\/\*([\s\S]*?)\*\//g, '') // 替换掉 /* ... */ 注释内容
      .replace(/(?<!(\\|\/|:))\/\/(.*)/g, '') // 非链接的双斜杠
      .match(regUrl); // 替换掉注释的行
    let ruleset = [];

    if (matches) {
      [...matches].forEach((link = '') => {
        if (match.test(link) && extensions.some((ext) => link.endsWith(ext))) {
          ruleset.push({ url: link });
        }
      });
    }

    return ruleset;
  }
}
