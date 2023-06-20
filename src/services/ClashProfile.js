import path from 'node:path';
import fs from 'node:fs';
import ini from 'ini';

import ProfileBase from './ProfileBase.js';
import utils from '../utils/index.js';

export default class ClashProfile extends ProfileBase {
  constructor(options = {}) {
    super(options);
  }

  transform(body, rootPath) {
    const content = body
      .replace(/^(\s+)?(#|;)(.*)?/gm, '') // 替换掉注释的行
      .replace(/^(\s+)?ruleset=/gm, 'ruleset[]='); // 替换字符以适配ini的解析

    const config = ini.parse(content);
    const ruleset = config.custom.ruleset
      .map((line) => {
        const [, ...args] = line.split(',');
        const link = args.join(',');

        if (/^(\s+)?http(s)?:\/\//.test(link)) {
          const { pathname } = new URL(link);

          return {
            url: link,
            filePath: path.join(rootPath, pathname),
            downloaded: false,
          };
        }

        return;
      })
      .filter((_) => _);

    return ruleset;
  }

  // async generate() {
  //   const { url, profileFolder, rulesetFolder, rootPath } = this;

  //   // 获取配置的内容
  //   let content = await utils.request(url);

  //   if (content) {
  //     // 解析内容，获取关联的资源链接 (关联资源放到ruleset目录)
  //     const ruleset = this.transform(content, `${rootPath}/${rulesetFolder}/`);

  //     // 递归下载
  //     for (const rule of ruleset) {
  //       const { url, filePath } = rule;
  //       rule.downloaded = await utils.downloadFile(url, filePath);
  //     }

  //     // 替换原有资源内容
  //     const origin = this.origin;
  //     ruleset.forEach((rule) => {
  //       const { url, downloaded } = rule;

  //       if (downloaded) {
  //         const newUrl = utils.replaceUrlOrigin(url, `${origin}/${rulesetFolder}/`);

  //         content = content.replace(url, newUrl);
  //       }
  //     });

  //     // 写入配置文件
  //     const uri = new URL(url);
  //     const { base: fileName, dir: relativeDir } = path.parse(uri.pathname);
  //     const fileDir = this.createPath(path.join(profileFolder, `./${relativeDir}/`));
  //     const filePath = path.join(fileDir, fileName);

  //     utils.mkdirSync(fileDir);
  //     fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

  //     console.log(`[INFO] 配置文件路径: ${filePath}`);
  //   } else {
  //     console.error(`[ERROR] 获取配置资源失败 ${utils.desensitize(url)}`);
  //   }
  // }
}
