import ini from 'ini';
import ProfileBase from './ProfileBase.js';

export default class ClashProfile extends ProfileBase {
  constructor(options = {}) {
    super(options);
  }

  filterAssets(body) {
    try {
      const content = body
        .replace(/^(\s+)?(#|;)(.*)?/gm, '') // 替换掉注释的行
        .replace(/^(\s+)?ruleset=/gm, 'ruleset[]='); // 替换字符以适配ini的解析
      const config = ini.parse(content);

      return config.custom.ruleset
        .map((line) => {
          const [, ...args] = line.split(',');
          const link = args.join(',');

          if (/^(\s+)?http(s)?:\/\//.test(link)) {
            return { url: link };
          }

          return;
        })
        .filter((_) => _);
    } catch (e) {
      console.log(`[ERROR] ClashProfile 解析资源失败: ${e.message}`);
      return [];
    }
  }
}
