import * as core from '@actions/core';

async function run() {
  try {

    const action = core.getInput('action') || process.env.ACTION || 'update-card';
    const run = (await import(`${action}.js`)).default;
    await run();
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
