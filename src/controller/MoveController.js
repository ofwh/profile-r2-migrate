import MoveProfile from '../services/MoveProfile.js';

export default class MoveController {
  urls = [];
  dir = '';
  urlPrefix = '';

  constructor(options = {}) {
    const { urls = [], dir = '', urlPrefix = '' } = options;
    this.urls = urls;
    this.dir = dir;
    this.urlPrefix = urlPrefix;
  }

  async start() {
    const { urls, dir, urlPrefix } = this;

    console.log(`[INFO] 开始处理 HTTP 文件搬迁配置...`);

    for (const url of urls) {
      const profile = new MoveProfile({ url, dir, urlPrefix });

      await profile.run();
    }

    console.log(`[INFO] HTTP 文件搬迁配置处理完成，详情请查看处理日志`);
  }
}
