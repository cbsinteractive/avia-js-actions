import { getInput, setFailed } from '@actions/core';
import addMilestoneToColumn from './add-milestone-to-column';
import moveCardToBoard from './move-card-to-board';
import moveCardToColumn from './move-card-to-column';
import updateCard from './update-card';

async function run() {
  try {
    const action = getInput('action') || process.env.ACTION;

    switch (action) {
      case 'update-card':
        await updateCard();
        break;

      case 'move-card-to-column':
        await moveCardToColumn();
        break;

      case 'move-card-to-board':
        await moveCardToBoard();
        break;

      case 'add-milestone-to-column':
        await addMilestoneToColumn();
        break;
    }
  }
  catch (error) {
    setFailed(error);
  }
}

run();
