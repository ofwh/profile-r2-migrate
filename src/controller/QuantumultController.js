import QuantumultProfile from '../services/QuantumultProfile.js';

export default class QuantumultController {
  urls = [];
  dir = '';
  origin = '';

  constructor(options = {}) {
    const { urls = [], dir = '', origin = '', match = /.*/, extensions = [] } = options;

    this.urls = urls;
    this.dir = dir;
    this.origin = origin;
    this.match = match;
    this.extensions = extensions;
  }

  async start() {
    const { urls, dir, origin, match, extensions } = this;

    console.log(`[INFO] 开始处理 Quantumult 配置...`);

    for (const url of urls) {
      const profile = new QuantumultProfile({ url, dir, origin, match, extensions });

      await profile.run();
    }

    console.log(`[INFO] Quantumult 配置处理完成，详情请查看处理日志`);
  }
}
