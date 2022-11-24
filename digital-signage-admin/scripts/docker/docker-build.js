const version = require('../version.js');
const sh = require('shelljs');

const imageName = 'digital-signage-admin';

sh.exec(`docker build -t ${imageName}:latest -t ${imageName}:${version} .`);

