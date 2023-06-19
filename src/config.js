import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const { UPLOAD_DIR = '', ORIGIN = '' } = process.env;
const content = fs.readFileSync('./PROFILES', 'utf-8');
const profiles = content.split('\n').filter((_) => _.replace(/\s+/g, ''));

export default {
  profiles,
  dir: UPLOAD_DIR,
  origin: ORIGIN,
};
