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

function deploy(repo, rev) {
    const fs = require('fs');
    const path = require('path');

    const depoyDest = path.join(__dirname, '..', '..', rev);

    try {
        fs.mkdirSync(depoyDest);

        // git clone https://pesu@bitbucket.org/pesu/growmat.git deployDest
        execFile('git', ['clone', repo, deployDest]);

        // git checkout stable
        process.chdir(deployDest);
        execFile('git', ['checkout', 'stable']);

        execFile('npm', ['install']);
    }
    catch(e) {
        console.error('Error occured during update. Will remain n current version');
        console.error(e);
    }
}