import path from 'node:path';
import fs from 'node:fs';

import utils from '../utils/index.js';

export default class ProfileBase {
  url = '';
  origin = '';
  rootDir = '';
  rootPath = '';

  profileDir = 'profiles'; // 配置文件保存的目录
  rulesetDir = 'assets'; // 关联资源保存的目录

  constructor(options = {}) {
    const { dir = '', url = '', origin = '' } = options;

    this.url = url;
    this.origin = origin;
    this.rootDir = dir;
    this.rootPath = this.createPath(dir);

    utils.mkdirSync(this.rootPath);
  }

  createPath(pathname) {
    return path.join(process.cwd(), `./${this.rootDir}`, `./${pathname}`);
  }

  async generate() {
    const { url, profileDir, rulesetDir, rootPath } = this;

    // 获取配置的内容
    console.log(`[INFO] 开始下载配置文件：${utils.desensitize(url)}`);
    let content = await utils.request(url);
    console.log(`[INFO] 配置文件下载完成，文件长度为 ${content.length}`);

    if (content) {
      // 解析内容，获取关联的资源链接 (关联资源放到ruleset目录)
      const ruleset = this.transform(content, `${rootPath}/${rulesetDir}/`);

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
          // 文件下载成功了才替换
          const newUrl = utils.replaceUrlOrigin(url, `${origin}/${rulesetDir}/`);

          content = content.replace(url, newUrl);
        }
      });

      // 写入配置文件
      const uri = new URL(url);
      const { base: fileName, dir: relativeDir } = path.parse(uri.pathname);
      const fileDir = this.createPath(path.join(profileDir, `./${relativeDir}/`));
      const filePath = path.join(fileDir, fileName);

      utils.mkdirSync(fileDir);
      fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

      console.log(`[INFO] 配置文件路径: ${filePath}`);
    } else {
      console.error(`[ERROR] 获取配置资源失败 ${utils.desensitize(url)}`);
    }
  }
}
