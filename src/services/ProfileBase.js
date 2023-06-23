import path from 'node:path';
import fs from 'node:fs';

import utils from '../utils/index.js';

export default class ProfileBase {
  url = '';
  origin = '';
  rootDir = '';
  rootPath = '';

  profileDir = 'profiles'; // 配置文件保存的目录
  assetsDir = 'assets'; // 关联资源保存的目录
  recursive = false; // 是否递归处理配置（即出了处理配置文件，同时递归处理关联的资源文件）

  urls = {}; // 已加载的资源文件信息

  constructor(options = {}) {
    const { dir = '', url = '', origin = '' } = options;

    this.url = url;
    this.origin = origin;
    this.rootDir = dir;
    this.rootPath = path.join(process.cwd(), `./${dir}`);
  }

  /**
   * 【抽象函数】过滤出需要处理的资源链接信息，子类需要重写此函数
   * @param {string} content 资源内容
   * @example
   *
   * ```
   * const content = await utils.request(url);
   * const assets = this.filterAssets(content);
   * console.log(assets); // [{url: 'xxx', file: '/path/to/assets/filename.ext', handled: true}]
   * ```
   */
  async filterAssets(content) {
    return [];
  }

  /**
   * 下载url资源并对下载后的资源内容进行处理
   * @param {string} url 资源地址
   * @param {string} folder 保存到的目录名称，支持目录层级。默认为资源目录（如果是配置目录可实际传值）
   * @returns {object} 资源对象
   */
  async handleRes(url, folder = '') {
    const logUrl = utils.desensitize(url);
    const cache = this.urls[url];

    if (cache) {
      // 之前处理过的资源，直接返回
      return cache;
    }

    let { ok, status, body } = await utils.request(url);

    if (ok) {
      // 文件下载成功
      const { origin, rootPath, assetsDir, recursive, urls } = this;
      const uri = new URL(url);
      const pathname = `/${folder || assetsDir}/${uri.pathname}`;

      const file = `${rootPath}/${pathname}`; // 文件保存路径(本地物理路径)
      const { dir: filePath } = path.parse(file); // 解析出文件所在的目录
      // 从链接地址的页面内容中，找到需要更新到新链接的资源信息列表
      let assets = [];

      // 文件的目录需要先递归创建好，否则会写入文件失败
      utils.mkdirSync(filePath);

      if (body instanceof Buffer) {
        // 图片文件
        fs.writeFileSync(file, body);
      } else {
        if (folder === this.profileDir || recursive) {
          // 只对配置文件，或者明确标记需要递归时，才对内容进行分析处理
          assets = await this.filterAssets(body, url);
        }

        // 循环下载并处理资源列表
        if (Array.isArray(assets) && assets.length > 0) {
          for (const asset of assets) {
            const { url: assetUrl } = asset;

            // 递归处理子资源
            const { newUrl, handled, assets: subAssets = [] } = await this.handleRes(assetUrl, assetsDir);

            // 如果子资源已经成功下载，则替换当前网页内容中的实际链接地址为新的资源地址
            if (handled) {
              body = body.replace(new RegExp(assetUrl, 'g'), newUrl);
            }

            // 扩展相关信息到资源列表中
            Object.assign(asset, { newUrl, handled, assets: subAssets });
          }
        }

        fs.writeFileSync(file, body, { encoding: 'utf-8' }); // 写入文件内容
      }

      console.log(`[INFO] 资源处理完成 ${logUrl}`);

      const info = {
        url,
        newUrl: utils.normalizeUrl(`${origin}/${pathname}`),
        handled: true,
        assets,
      };

      urls[url] = info;

      return info;
    }

    console.error(`[ERROR] 资源下载失败，跳过处理 ${logUrl}`);
    return {
      url,
      newUrl: url, // 资源内容为空（下载失败）则不进行链接替换
      handled: false,
      assets: [],
    };
  }

  async run() {
    const { url, profileDir } = this;
    const logUrl = utils.desensitize(url);

    console.log(`[INFO] 开始处理配置文件 ${logUrl}`);
    const results = await this.handleRes(url, profileDir);
    console.log(`[INFO] 配置文件处理完成 ${logUrl}`);

    return results;
  }
}
