import * as core from '@actions/core';
import moveCardToColumn from './move-card-to-column';
import updateCard from './update-card';

async function run() {
  try {
    const action = core.getInput('action') || process.env.ACTION;

    switch (action) {
      case 'update-card':
        await updateCard();
        break;

      case 'move-card-to-column':
        await moveCardToColumn();
        break;
    }
  }
  catch (error) {
    core.setFailed(error);
  }
}

run();
