import * as cp from 'node:child_process';
import * as fs from 'node:fs';

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
  fs.writeFileSync(file, `${content};\nexport const foo${randInt()} = 'foo'`);
}

function updateNestedLeafPkg(i) {
  const file = `./ts-solution/packages/nested-1-${i}/src/index.tsx`;
  const content = fs.readFileSync(file).toString();
  fs.writeFileSync(file, `${content};\nexport const foo${randInt()} = 'foo'`);
}

function updateNestedRootPkg() {
  const file = `./ts-solution/packages/nested-1/src/index.tsx`;
  const content = fs.readFileSync(file).toString();
  fs.writeFileSync(file, `${content};\nexport const foo${randInt()} = 'foo'`);
}

function resetChanges() {
  cp.execSync('git checkout ts-solution');
}

function randInt() {
  return Math.ceil(Math.random() * 1000);
}

function formatMemory(kb) {
  const m = parseInt(kb);
  if (m >= 1_000_000) {
    return `${(m / 1_000_000).toFixed(2)} GB`;
  } else if (m >= 1000)  {
    return `${(m / 1_000).toFixed(2)} MB`;
  } else {
    return `${m} KB`;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exec(cmd, opts) {
  return new Promise((resolve) => {
    let data = '';
    const p = cp.exec(cmd, opts);
    p.stdout.on('data', (buf) => {
      data += buf.toString();
    });
    p.stderr.on('data', (buf) => {
      data += buf.toString();
    });
    p.on('close', () => {
      resolve(data);
    });
  });
}

process.on('SIGINT', () => {
  resetChanges()
  process.exit();
});
process.on('exit', () => resetChanges());

let start, end, output, mem;

const timeCmd = process.platform === 'darwin' ? 'gtime' : 'time';
const memRegexp = /Maximum resident set size \(kbytes\): (?<mem>\d+)/;

console.log('Timing how long typechecks take for old vs new TS setup. This will take a few minutes.\n');

console.log('INTEGRATED SETUP (OLD)');
console.log('----------------------');

process.stdout.write('Timing typecheck... ');
cleanOutput();
start = performance.now();
output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
  cwd: 'ts-integrated',
});
end = performance.now();
mem = output.match(memRegexp).groups.mem;
process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);

console.log('\nTS SOLUTION SETUP (NEW)');
console.log('-----------------------');

cleanOutput();

process.stdout.write('Timing typecheck (cold)... ')
start = performance.now();
output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
  cwd: 'ts-solution',
});
end = performance.now();
mem = output.match(memRegexp).groups.mem;
process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);

await delay(2000);

process.stdout.write('Timing typecheck (hot)... ');
start = performance.now();
output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
  cwd: 'ts-solution',
});
end = performance.now();
mem = output.match(memRegexp).groups.mem;
process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);


const benchWarmLeafUpdates = async (n) => {
  process.stdout.write(`Timing typecheck (warm - ${n} pkg updated)... `);
  for (let i = 1; i <= n; i++) {
    updatePkg(i);
  }
  start = performance.now();
  output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
    cwd: 'ts-solution',
  });
  end = performance.now();
  mem = output.match(memRegexp).groups.mem;
  process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);
};

await delay(2000);
await benchWarmLeafUpdates(1);
await delay(2000);
await benchWarmLeafUpdates(5);
await delay(2000);
await benchWarmLeafUpdates(25);
await delay(2000);
await benchWarmLeafUpdates(100);

await delay(2000);

process.stdout.write('Timing typecheck (warm - 1 nested leaf pkg updated)... ');
updateNestedLeafPkg(1);
start = performance.now();
output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
  cwd: 'ts-solution',
});
end = performance.now();
mem = output.match(memRegexp).groups.mem;
process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);

await delay(2000);

process.stdout.write('Timing typecheck (warm - 2 nested leaf pkg updated)... ');
updateNestedLeafPkg(1);
updateNestedLeafPkg(2);
start = performance.now();
output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
  cwd: 'ts-solution',
});
end = performance.now();
mem = output.match(memRegexp).groups.mem;
process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);

await delay(2000);

process.stdout.write('Timing typecheck (warm - 1 nested root pkg updated)... ');
updateNestedRootPkg();
start = performance.now();
output = await exec(`${timeCmd} -v npx nx typecheck demo --skip-nx-cache`, {
  cwd: 'ts-solution',
});
end = performance.now();
mem = output.match(memRegexp).groups.mem;
process.stdout.write(`${toSeconds(end - start)} (max memory: ${formatMemory(mem)})\n`);

