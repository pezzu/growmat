const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const targetDir = process.argv[3];

try{
    switch(command) {

        case 'deploy':
            if(targetDir != null) {
                const repository = child_process.execFileSync('git', ['remote', 'get-url', 'origin'], {timeout: 20000}).toString().trim();
                const environmentDir = path.join(path.resolve(targetDir), 'prod');;

                deploy(repository, environmentDir);
                restart(environmentDir);
            }
            else {
                usage();
            }
            break;

        case 'update':
            const repository = child_process.execFileSync('git', ['remote', 'get-url', 'origin'], {timeout: 20000}).toString().trim();
            const environment = targetDir? path.resolve(targetDir) : path.join(__dirname , '..', '..');

            const revision = getNewRevision(repository, path.join(environment, 'prod'));

            if(revision != null) {
                deploy(repository, path.join(environment, 'update'));
                restart(environmentDir);
            }
            break;

        default:
            usage();
    }
}
catch(e) {
    console.error('Error occurred during update. Will remain on current version\n', e);
    process.exit(1);
}


function usage() {
    console.error
(`Usage: ${path.basename(process.argv[1])} <action> [environment-dir]

Perform deployment and autoupdate

action:
    deploy: deploy from git to environment-dir
    update: check repository and deploy from git to environment-dir or $CWD/..

environment-dir : target directory which contains 'prod' & 'update' folders`);
    process.exit(1);
}


function getNewRevision(repository, localDir) {
    // git rev-parse HEAD
    const local = child_process.execFileSync('git', ['rev-parse', 'HEAD'], {cwd: localDir, timeout: 20000}).slice(0, 40).toString();

    // git ls-remote --tags https://pesu@bitbucket.org/pesu/growmat.git stable
    const remote = child_process.execFileSync('git', ['ls-remote', '-q', '--tags', repository, 'stable'], {timeout: 20000}).slice(0, 40).toString();

    if((typeof(local) === 'string') && (typeof(remote) === 'string') && (local !== remote)) {
        console.log('Update available to ' + remote + ' (currently: ' + local + ')');
        return remote;
    }
    else {
        return null;
    }
}


function deploy(repository, environmentDir) {
    if(fs.existsSync(environmentDir)) {
        console.error('Folder ' + environmentDir + ' already exists. Update abandoned');
        process.exit(1);
    }

    fs.mkdirSync(environmentDir);

    console.log('Checking out from git');
    child_process.spawnSync('git', ['clone', '-q', '--branch', 'stable', repository, environmentDir], {stdio: 'inherit'});

    console.log('Running npm install');
    child_process.spawnSync('npm', ['install', '--no-save'], {cwd: environmentDir, shell: true, stdio: 'inherit'});

    const restartScriptSrc = path.join(environmentDir, 'deploy/restart.sh');
    const restartScriptProd = path.join(environmentDir, '../restart.sh');

    // fs-extra.copySync(restartScript, destination, {overwrite: true});
    fs.writeFileSync(restartScriptProd, fs.readFileSync(restartScriptSrc));
}


function restart(environmentDir) {
    const restartScript = path.join(environmentDir, '../restart.sh');
    child_process.spawn(restartScript);
}