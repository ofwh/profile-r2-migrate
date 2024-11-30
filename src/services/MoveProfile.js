import ProfileBase from './ProfileBase.js';

export default class MoveProfile extends ProfileBase {
  constructor(options = {}) {
    super({
      ...options,
      download: true, // 搬迁文件，则直接下载buffer，不需要处理内容
    });
  }
}
