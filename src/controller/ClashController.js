import ClashProfile from '../services/ClashProfile.js';

export default class ClashController {
  urls = [];
  dir = '';
  origin = '';

  constructor(options = {}) {
    const { urls = [], dir = '', origin = '' } = options;

    this.urls = urls;
    this.dir = dir;
    this.origin = origin;
  }

  async start() {
    const { urls, dir, origin } = this;

    console.log(`[INFO] 开始处理 Clash 配置...`);

    for (const url of urls) {
      const profile = new ClashProfile({ url, dir, origin });

      await profile.generate();
    }

    console.log(`[INFO] Clash 配置处理完成，详情请查看处理日志`);
  }
}
