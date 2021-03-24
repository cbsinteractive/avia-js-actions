import * as core from '@actions/core';
import updateCard from './update-card';

async function run() {
  try {
    const action = core.getInput('action') || process.env.ACTION || 'update-card';

    switch (action) {
      case 'update-card':
        await updateCard();
        break;
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
