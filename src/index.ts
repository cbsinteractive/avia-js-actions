import { getInput, setFailed } from '@actions/core';
import addMilestoneToColumn from './add-milestone-to-column';
import moveCardToColumn from './move-card-to-column';
import updateCard from './update-card';
import columnFlush from './column-flush';

async function run() {
  try {
    const action = getInput('action') || process.env.ACTION;

    console.log('hello world');

    switch (action) {
      case 'update-card':
        await updateCard();
        break;

      case 'column-flush':
        console.log('columnFlush!!!');
        await columnFlush();
        break;

      case 'move-card-to-column':
        await moveCardToColumn();
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
