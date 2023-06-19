import path from 'node:path';
import fs from 'node:fs';

import utils from '../utils/index.js';

export default class Profile {
  url = '';
  origin = '';
  rootDir = '';
  rootPath = '';

  /**
   * 配置文件的目录
   */
  profileFolder = 'profiles';
  /**
   * 规则文件的目录
   */
  rulesetFolder = 'ruleset';

  constructor(options = {}) {
    const { dir = '', url = '', origin = '' } = options;

    this.url = url;
    this.origin = origin;
    this.rootDir = dir;
    this.rootPath = this.createPath(dir);

    // 创建存储目录，防止目录不存在导致失败
    utils.mkdirSync(this.rootPath);
  }

  createPath(pathname) {
    return path.join(process.cwd(), `./${this.rootDir}`, `./${pathname}`);
  }

  async generate() {
    const { url, profileFolder, rulesetFolder, rootPath } = this;

    // 获取配置的内容
    let content = await utils.request(url);

    if (content) {
      // 解析内容，获取关联的资源链接 (关联资源放到ruleset目录)
      const ruleset = utils.transform(content, `${rootPath}/${rulesetFolder}/`);

      // 递归下载
      for (const rule of ruleset) {
        const { url, filePath } = rule;
        rule.downloaded = await utils.downloadFile(url, filePath);
      }

      // 替换原有资源内容
      const origin = this.origin;
      ruleset.forEach((rule) => {
        const { url, downloaded } = rule;

        if (downloaded) {
          const newUrl = utils.replaceUrlOrigin(url, `${origin}/${rulesetFolder}/`);

          content = content.replace(url, newUrl);
        }
      });

      // 写入配置文件
      const uri = new URL(url);
      const { base: fileName, dir: relativeDir } = path.parse(uri.pathname);
      const fileDir = this.createPath(path.join(profileFolder, `./${relativeDir}/`));
      const filePath = path.join(fileDir, fileName);

      utils.mkdirSync(fileDir);
      fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

      console.log(`[INFO] 配置文件路径: ${filePath}`);
    } else {
      console.error(`[ERROR] 获取配置资源失败 ${utils.desensitize(url)}`);
    }
  }
}
