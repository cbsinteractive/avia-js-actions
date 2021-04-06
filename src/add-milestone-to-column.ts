
import { context } from './octokit-client';

export default async function addMilestoneToColumn() {
  console.log(context);
  // const branch = context.payload.pull_request.head.ref;
  // const issueNumber = branch.split('/').pop();
  // const project = await getProjectByName('Avia JS Sprint Board');
  // const card = await getCardByIssue(issueNumber, project.number);

  // if (!card) {
  //   return;
  // }

  // const toColumn = await getColumnByName('Ready for Review', project.number);

  // moveExistingCard(toColumn.id, card.id);
}
