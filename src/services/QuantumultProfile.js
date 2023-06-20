import path from 'node:path';
import ProfileBase from './ProfileBase.js';

const regUrl = /http(s)?:\/\/([^,\s]*)/g;

export default class QuantumultProfile extends ProfileBase {
  constructor(options = {}) {
    super(options);

    // QX是通过正则匹配链接来处理的
    this.match = options.match;
  }

  transform(body, rootPath) {
    const { match } = this;
    // 匹配所有url链接，然后走白名单进行替换
    const matches = body.replace(/^(\s+)?(#|;)(.*)?/gm, '').match(regUrl); // 替换掉注释的行
    let ruleset = [];

    if (matches) {
      [...matches].forEach((link) => {
        if (match.test(link)) {
          const { pathname } = new URL(link);

          ruleset.push({
            url: link,
            filePath: path.join(rootPath, pathname),
            downloaded: false,
          });
        }
      });
    }

    return ruleset;
  }
}
