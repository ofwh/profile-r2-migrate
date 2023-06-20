import fs from 'node:fs';
import path from 'node:path';
import ini from 'ini';

const desensitize = (link) => {
  const uri = new URL(link);

  return link.replace(uri.host, '***');
};

const mkdirSync = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const request = async (url, { method = 'GET', headers = {} } = {}) => {
  try {
    console.log(`[INFO] 开始请求 ${desensitize(url)}`);
    const response = await fetch(url, {
      method,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        ...headers,
      },
    });
    const body = await response.text();

    return body;
  } catch (e) {
    console.error(`[ERROR] 请求网络资源失败: ${desensitize(url)} - ${e.message}`);
    return '';
  }
};

const downloadFile = async (url, filePath) => {
  try {
    const body = await request(url);

    if (body) {
      mkdirSync(path.dirname(filePath));
      fs.writeFileSync(filePath, body, { encoding: 'utf-8' });

      return true;
    }

    return false;
  } catch (e) {
    console.error(`[ERROR] 下载文件失败: ${desensitize(url)} - ${e.message}`);

    return false;
  }
};

const replaceUrlOrigin = (url, origin) => {
  const uri = new URL(url);

  // 替换除协议头紧跟的双斜杠之外的所有双斜杠
  return url.replace(uri.origin, origin).replace(/(?<!\:)\/\//g, '/');
};

export default {
  desensitize,
  mkdirSync,
  request,
  downloadFile,
  replaceUrlOrigin,
};
