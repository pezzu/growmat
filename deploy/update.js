const execFile = require('child_process').execFileSync;

//git remote get-url origin
const repo = execFile('git', ['remote', 'get-url', 'origin'], {timeout: 20000}).toString();

// git rev-parse HEAD
const local = execFile('git', ['rev-parse', 'HEAD'], {timeout: 20000}).slice(0, 40).toString();

// git ls-remote --tags https://pesu@bitbucket.org/pesu/growmat.git stable
const remote = execFile('git', ['ls-remote', '-q', '--tags', repo, 'stable'], {timeout: 20000}).slice(0, 40).toString();

// console.log('Local: ' + local);
// console.log('Remote: ' + remote);

if((typeof(local) === 'String') && (typeof(remote) === 'String') && (local !== remote)) {
    console.log('Performing update to ' + remote + ' (currently: ' + local + ')');
    deploy(repo, remote);
}


function deploy(repository, destination) {
    const fs = require('fs');
    const path = require('path');

    // const prodDir = path.join(destination, 'live');
    const updtDir = path.join(destination, 'update');

    if(fs.existSync(updtDir)) {
        console.error('Folder ' + updtDir + ' already exists. Update abandoned');
        process.exit(1);
    }

    try {
        fs.mkdirSync(updtDir);

        // git clone --branch stable https://pesu@bitbucket.org/pesu/growmat.git updtDir
        execFile('git', ['clone', '--branch', 'stable', repository, updtDir]);

        process.chdir(updtDir);
        execFile('npm', ['install']);

        const restartScript = path.join(updtDir, 'deploy/restart.sh');
        // fs-extra.copySync(restartScript, destination, {overwrite: true});
        fs.writeFileSync(path.join(destination, 'restart.sh'), fs.readFileSync(restartScript));
    }
    catch(e) {
        console.error('Error occured during update. Will remain on current version');
        console.error(e);
    }
}