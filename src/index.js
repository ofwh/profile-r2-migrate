import path from 'node:path';
import ProfileController from './controller/index.js';
import config from './config.js';

const { profiles, dir, origin } = config;

const controller = new ProfileController({
  profiles,
  dir: path.join('../', dir), // 配置时只给一个文件夹名称，这里要相对src/index.js做路径处理
  origin,
});

controller.start();
