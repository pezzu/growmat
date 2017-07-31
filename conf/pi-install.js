const isPi = require('detect-rpi');

if(isPi()) {
    const package = require('../package.json');
    const child_process = require('child_process');

    try {
        Object.keys(package.piDependencies).forEach(function(dependency) {
            const command = "npm install " + dependency+"@"+package.piDependencies[dependency] + " --no-save";
            console.log(command);
            child_process.execSync(command);
        });
    }
    catch(err) {
        process.exit(1);
    }
}

