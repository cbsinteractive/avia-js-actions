
import { context, getColumnByName, getProjectByName } from './octokit-client';

export default async function addMilestoneToColumn() {
  const { milestone: milestoneName, project: projectName, column: columnName } = context.payload.inputs;

  console.log('Milestone', milestoneName);

  const project = await getProjectByName(projectName);
  if (!project) {
    return;
  }

  const column = await getColumnByName(columnName, project.number);
  if (!column) {
    return;
  }

  console.log("Column", column);

  //const issues = await getColumnIssueNumbers(column.id);
  //console.log("Cards", issues);
  // const card = await getCardByIssue(issueNumber, project.number);

  // if (!card) {
  //   return;
  // }

  // const toColumn = await getColumnByName('Ready for Review', project.number);

  // moveExistingCard(toColumn.id, card.id);
}
