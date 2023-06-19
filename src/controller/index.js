import Profile from '../services/profile.js';

export default class ProfileController {
  profiles = [];
  dir = '';
  origin = '';

  constructor(options = {}) {
    const { profiles = [], dir = '', origin = '' } = options;

    this.profiles = profiles;
    this.dir = dir;
    this.origin = origin;
  }

  async start() {
    const { profiles, dir, origin } = this;

    console.log(`[INFO] 开始处理配置...`);

    for (const url of profiles) {
      const profile = new Profile({ url, dir, origin });

      await profile.generate();
    }

    console.log(`[INFO] 配置处理完成，详情请查看处理日志`);
  }
}
