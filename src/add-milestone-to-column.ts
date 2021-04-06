
import { context, getColumnByName, getMilestoneByName, getProjectByName } from './octokit-client';

export default async function addMilestoneToColumn() {
  const { milestone: milestoneName, project: projectName, column: columnName } = context.payload.inputs;

  const milestone = await getMilestoneByName(milestoneName);
  console.log('Milestone', milestone);
  if (!milestone) {
    return;
  }

  const project = await getProjectByName(projectName);
  if (!project) {
    return;
  }

  const column = await getColumnByName(columnName, project.number);
  if (!column) {
    return;
  }

  const issues = column.cards.map((card: any) => card.content);
  console.log(issues);

  // await parallel(...issues.map((issue: any) => updateIssue(issue.number, { milestone:})));
}
