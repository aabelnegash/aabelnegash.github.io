import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readdir, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publishBranch = 'gh-pages';
const expectedRepository = 'aabelnegash/aabelnegash.github.io';

function git(args, { cwd = projectRoot, allowedStatuses = [0] } = {}) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error || !allowedStatuses.includes(result.status)) {
    // Do not echo remote URLs, credential-helper output, or authentication errors.
    throw new Error(
      `Git ${args[0]} failed. Check that Git is installed, your GitHub credentials have ` +
      `write access to ${expectedRepository}, and your network is available. ` +
      'If another deployment changed gh-pages, rerun the deployment.',
    );
  }
  return { output: result.stdout.trim(), status: result.status };
}

function isExpectedOrigin(origin) {
  return [
    /^https:\/\/github\.com\/aabelnegash\/aabelnegash\.github\.io(?:\.git)?\/?$/i,
    /^git@github\.com:aabelnegash\/aabelnegash\.github\.io(?:\.git)?$/i,
    /^ssh:\/\/git@github\.com\/aabelnegash\/aabelnegash\.github\.io(?:\.git)?\/?$/i,
  ].some((pattern) => pattern.test(origin));
}

async function deploy() {
  const checkoutRoot = git(['rev-parse', '--show-toplevel']).output;
  if (await realpath(checkoutRoot) !== await realpath(projectRoot)) {
    throw new Error('Initialize this portfolio directory as its own Git repository before deploying.');
  }

  const origin = git(['remote', 'get-url', 'origin']).output;
  if (!isExpectedOrigin(origin)) {
    throw new Error(`Set this repository's origin to https://github.com/${expectedRepository}.git before deploying.`);
  }

  console.log('Building the portfolio…');
  const build = spawnSync(process.execPath, [join(projectRoot, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  });
  if (build.error || build.status !== 0) {
    throw new Error('The production build failed. Install dependencies and fix the build before deploying.');
  }

  const dist = join(projectRoot, 'dist');
  if (!(await stat(join(dist, 'index.html'))).isFile()) {
    throw new Error('The production build did not create dist/index.html. Check the Vite output configuration.');
  }

  const branchExists = git(['ls-remote', '--exit-code', '--heads', 'origin', `refs/heads/${publishBranch}`], {
    allowedStatuses: [0, 2],
  }).status === 0;

  const temporaryRoot = await mkdtemp(join(tmpdir(), 'abel-portfolio-deploy-'));
  try {
    const checkout = join(temporaryRoot, 'checkout');
    git(['clone', '--no-checkout', '--origin', 'origin', origin, checkout]);
    if (branchExists) {
      git(['switch', '--create', publishBranch, '--track', `origin/${publishBranch}`], { cwd: checkout });
    } else {
      git(['switch', '--orphan', publishBranch], { cwd: checkout });
    }

    // Only the disposable publishing checkout is cleared; the source checkout stays intact.
    for (const entry of await readdir(checkout)) {
      if (entry !== '.git') await rm(join(checkout, entry), { recursive: true, force: true });
    }
    for (const entry of await readdir(dist)) {
      if (entry === '.git') throw new Error('Unexpected .git entry in dist. Remove it before deploying.');
      await cp(join(dist, entry), join(checkout, entry), { recursive: true });
    }
    await writeFile(join(checkout, '.nojekyll'), '');

    git(['add', '--all'], { cwd: checkout });
    const changed = git(['diff', '--cached', '--quiet'], { cwd: checkout, allowedStatuses: [0, 1] }).status === 1;
    if (!changed) {
      console.log('The published files already match this build.');
      return;
    }

    // Reuse the source repository's identity, including a locally configured identity.
    const name = git(['config', 'user.name'], { allowedStatuses: [0, 1] }).output;
    const email = git(['config', 'user.email'], { allowedStatuses: [0, 1] }).output;
    if (!name || !email) {
      throw new Error('Configure git user.name and user.email in this source repository, then rerun the deployment.');
    }
    git(['-c', `user.name=${name}`, '-c', `user.email=${email}`, 'commit', '-m', 'Deploy portfolio'], { cwd: checkout });
    git(['push', 'origin', `HEAD:refs/heads/${publishBranch}`], { cwd: checkout });
    console.log(`Published to ${publishBranch}. GitHub Pages will serve https://aabelnegash.github.io/ after processing.`);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

deploy().catch((error) => {
  console.error(`Deployment stopped: ${error.message}`);
  process.exitCode = 1;
});
