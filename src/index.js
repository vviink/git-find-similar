import { execSync } from 'child_process';

const remoteName = process.argv[2];

const shellOptions = {
  encoding: 'utf-8',
  cwd: '/home/vitalii/Projects/pharmacy-service'
};

const branches = execSync('git branch -a', shellOptions);

const branchRx = /^[\s*]*([\w\/\-\_\.]+)( [->\w\/\s]*)?/
const changesRx = /^\s*(\d+)/;

const result = branches
  .split('\n')
  .map(line => branchRx.exec(line)?.[1])
  .filter(line => !!line && line.startsWith(`remotes/${remoteName}`) && !line.includes('HEAD'))
  .map(line => {
    const branch = line.replace('remotes/', '');
    const diff = execSync(`git diff --shortstat ..${branch}`, shellOptions);
    let result = changesRx.exec(diff)?.[1];
    if (result === undefined) {
      console.warn(`diff is undefined in "${diff}" for "${branch}"`);
    } else  {
      result = parseInt(result);
    }
    return { branch, result };
  });

console.log(JSON.stringify(result, null, 2));
