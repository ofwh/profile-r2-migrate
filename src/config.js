import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

// 从文件中读取并解析配置地址
const readFileSync = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  // 支持换行，英文逗号，英文竖线分割多个链接地址
  const urls = content.split(/\n|,|\|/).filter((_) => _.replace(/\s+/g, ''));

  return urls;
};

const { UPLOAD_DIR = '', URL_PREFIX = '' } = process.env;
const clashUrls = readFileSync('./configs/CLASH');
const qxUrls = readFileSync('./configs/QUANTUMULTX');
const httpLinks = readFileSync('./configs/URLS');

export default {
  format: {
    raw: ['.png', '.jpg', '.jpeg', '.bmp', '.mmdb'], // 需要下载的原始资源类型，使用Buffer保存
  },
  clash: { urls: clashUrls },
  quantumult: {
    urls: qxUrls,
    // 通过域名模糊匹配链接地址，包含的则进行资源迁移
    match: /github\.com|github\.githubassets\.com|raw\.githubusercontent\.com|myqcloud\.com/,
    // 匹配后缀，不要给像html,md等页面类型的后缀，否则可能会因为有一些其他页面链接地址，导致死循环
    extensions: ['.conf', '.js', '.list', '.yaml', '.yml', '.toml', '.snippet', '.qxrewrite', '.json', '.png', '.jpg'],
  },
  http: { urls: httpLinks },
  dir: UPLOAD_DIR,
  urlPrefix: URL_PREFIX,
};
