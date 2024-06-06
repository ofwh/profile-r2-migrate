import path from 'node:path';
import ProfileBase from './ProfileBase.js';

// URL地址规则
// 要求以http或者https开头的协议
// 链接中过滤一些常见的非链接字符串（如一些配置中的正则表达式和一些js代码中的字符串关键字符）
// 要求有结尾扩展名（不严格，会命中域名后缀），且链接紧跟着 “空格+逗号” 或者 “行尾”
const regUrl = /http(s)?:\/\/([^,\s\$#*'"`\{\}\[\]\(\)\\]*)\.(\w+)(?=((\s*,)|'|"|$))/gm;

export default class QuantumultProfile extends ProfileBase {
  recursive = true;

  constructor(options = {}) {
    super(options);

    // QX是通过正则匹配链接来处理的
    this.match = options.match;
    this.extensions = options.extensions || [];
  }

  filterAssets(body, url) {
    const { match, extensions } = this;
    // 匹配所有url链接，然后走白名单进行替换
    const matches = body
      // 替换掉 # 和 ; 开头的注视内容 (yaml文件)
      .replace(/^(\s+)?(#|;)(.*)?/gm, '')
      // 替换掉 /* ... */ 注释内容（这里有bug，会替换掉规则里面的url正则，所以这里仅匹配开头就是注释的场景）
      .replace(/(?<!(\w))\/\*([\s\S]*?)\*\//g, '')
      // 非链接的双斜杠
      .replace(/(?<!(\\|\/|:))\/\/(.*)/g, '')
      .match(regUrl);
    let ruleset = [];

    if (matches) {
      [...matches].forEach((link = '') => {
        if (match.test(link) && extensions.some((ext) => link.endsWith(ext))) {
          ruleset.push({ url: link.replace(',', '').trim() });
        }
      });
    }

    return ruleset;
  }
}
