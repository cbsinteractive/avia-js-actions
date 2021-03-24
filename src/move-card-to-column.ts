
import { context } from './octokit-client';

// const projectUrl = 'https://github.com/cbsinteractive/github-actions-test/projects/2';

export default async function moveCardToColumn() {
  console.log("moveCardToColumn", context);
  // const issueNumber = context.head_ref.split('/')[1];
  // console.log('ISSUE lookup: ', issueNumber, context.head_ref);
  // const card = await getCard(issueNumber, 'In Progress', projectUrl);
  // const toColumn = await getColumnIdByName('Ready for Review', projectUrl, null);

  // moveExistingCard(toColumn.column_id, card.id);
}
