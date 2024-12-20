import * as cp from 'node:child_process';

let start, end;

console.log('Timing typecheck (cold)...')

cleanOutput();
start = performance.now()
cp.execSync('npx nx typecheck demo --skip-nx-cache', {
  cwd: 'ts-solution',
});
end = performance.now();
console.log(`Time for typecheck (cold): ${end - start}`);

start = performance.now()
cp.execSync('npx nx typecheck demo --skip-nx-cache', {
  cwd: 'ts-solution',
});
end = performance.now();
console.log(`Time for typecheck (hot): ${end - start}`);


function cleanOutput() {
  cp.execSync(`find packages -name out-tsc | xargs rm -rf`, {
    cwd: 'ts-solution',
  });
}
