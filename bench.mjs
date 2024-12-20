import * as cp from 'node:child_process';
import * as fs from 'node:fs';

let start, end;
const originals = new Map();

console.log('Timing how long typechecks take for old vs new TS setup. This will take a few minutes.\n');

console.log('INTEGRATED SETUP (OLD)');
console.log('----------------------');

process.stdout.write('Timing typecheck... ');
cleanOutput();
start = performance.now();
cp.execSync('npx nx typecheck demo --skip-nx-cache', {
  cwd: 'ts-integrated',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

console.log('\nTS SOLUTION SETUP (NEW)');
console.log('-----------------------');

cleanOutput();

process.stdout.write('Timing typecheck (cold)... ')
start = performance.now();
cp.execSync('npx nx typecheck demo --skip-nx-cache', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

process.stdout.write('Timing typecheck (hot)... ');
start = performance.now();
cp.execSync('npx nx typecheck demo', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

process.stdout.write('Timing typecheck (warm - 1 pkg updated)... ');
updatePkg(1);
start = performance.now();
cp.execSync('npx nx typecheck demo', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

process.stdout.write('Timing typecheck (warm - 5 pkg updated)... ');
updatePkg(2);
updatePkg(3);
updatePkg(4);
updatePkg(5);
updatePkg(6);
start = performance.now();
cp.execSync('npx nx typecheck demo', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

process.stdout.write('Timing typecheck (warm - 1 nested leaf pkg updated)... ');
updateNestedLeafPkg(1);
start = performance.now();
cp.execSync('npx nx typecheck demo', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

process.stdout.write('Timing typecheck (warm - 2 nested leaf pkg updated)... ');
updateNestedLeafPkg(1);
updateNestedLeafPkg(2);
start = performance.now();
cp.execSync('npx nx typecheck demo', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

process.stdout.write('Timing typecheck (warm - 1 nested root pkg updated)... ');
updateNestedRootPkg();
start = performance.now();
cp.execSync('npx nx typecheck demo', {
  cwd: 'ts-solution',
});
end = performance.now();
process.stdout.write(`${toSeconds(end - start)}\n`);

resetChanges();

/* -------------------------------------------------------------------------- */

function cleanOutput() {
  cp.execSync(`find packages -name out-tsc | xargs rm -rf`, {
    cwd: 'ts-solution',
  });
}

function toSeconds(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}


function updatePkg(i) {
  const file = `./ts-solution/packages/lib-${i}/src/index.tsx`;
  const content = fs.readFileSync(file).toString();
  originals.set(file, content);
  fs.writeFileSync(file, `${content};\nexport const foo${randInt()} = 'foo'`);
}

function updateNestedLeafPkg(i) {
  const file = `./ts-solution/packages/nested-1-${i}/src/index.tsx`;
  const content = fs.readFileSync(file).toString();
  originals.set(file, content);
  fs.writeFileSync(file, `${content};\nexport const foo${randInt()} = 'foo'`);
}

function updateNestedRootPkg() {
  const file = `./ts-solution/packages/nested-1/src/index.tsx`;
  const content = fs.readFileSync(file).toString();
  originals.set(file, content);
  fs.writeFileSync(file, `${content};\nexport const foo${randInt()} = 'foo'`);
}

function resetChanges() {
  originals.forEach(([file, content]) => {
    fs.writeFileSync(file, content);
  });
  originals.clear();
}

function randInt() {
  return Math.ceil(Math.random() * 1000);
}
