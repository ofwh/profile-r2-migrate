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
          // line数据可能是如下格式
          // 全球直连,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml
          // 全球直连,clash-domain:https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.yaml,86400
          const [, ...args] = line.split(',');
          const link = args.join(',');

          if (/^(\s+)?(clash-domain:)?http(s)?:\/\//.test(link)) {
            return {
              url: link
                .replace('clash-domain:', '') // 替换开头无效的数据
                .replace(/(,\d+)$/, ''), // TODO，替换末尾的更新时间戳，暂时用这个方式处理，后续需解析内容
            };
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
