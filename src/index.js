import path from 'node:path';
import ClashController from './controller/ClashController.js';
import QuantumultController from './controller/QuantumultController.js';
import config from './config.js';

const {
  clash: { urls: clashUrls = [] },
  quantumult: { urls: qxUrls, match = /.*/, extensions },
  dir,
  origin,
} = config;

const start = async () => {
  const rootDir = path.join('../', dir); // 配置时只给一个文件夹名称，这里要相对src/index.js做路径处理
  const clash = new ClashController({ urls: clashUrls, dir: rootDir, origin });
  const quantumult = new QuantumultController({ urls: qxUrls, dir: rootDir, origin, match, extensions });

  await clash.start();
  await quantumult.start();
};

start();
