const execFile = require('child_process').execFileSync;

// `git rev-parse HEAD`
const local = execFile('git', ['rev-parse', 'HEAD'], {timeout: 20000}).slice(0, 40).toString();

// `git ls-remote --tags https://pesu@bitbucket.org/pesu/growmat.git stable`
const remote = execFile('git', ['ls-remote', '-q', '--tags', 'https://pesu@bitbucket.org/pesu/growmat.git', 'stable'], {timeout: 20000}).slice(0, 40).toString();

console.log('Local: ' + local);
console.log('Remote: ' + remote);

if((typeof(local) === 'String') && (typeof(remote) === 'String') && (local !== remote)) {
    console.log('Performing update');
    doUpdate();
}
else {
    console.log('Update is not required');
}


function doUpdate() {

}