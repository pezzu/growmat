const isPi = require('detect-rpi');

if(isPi()) {
    const package = require('../package.json');
    const child_process = require('child_process');

    Object.keys(package.piDependencies).forEach(function(dependency) {
        console.log('npm install ' + dependency+'@'+package.piDependencies[dependency] + ' --no-save');
        child_process.spawnSync('npm', ['install', dependency+'@'+package.piDependencies[dependency], '--no-save'], {stdio: 'inherit', shell: true});
    });
}

