import ClashProfile from '../services/ClashProfile.js';

export default class ClashController {
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

    console.log(`[INFO] 开始处理 Clash 配置...`);

    for (const url of urls) {
      const profile = new ClashProfile({ url, dir, urlPrefix });

      await profile.run();
    }

    console.log(`[INFO] Clash 配置处理完成，详情请查看处理日志`);
  }
}
