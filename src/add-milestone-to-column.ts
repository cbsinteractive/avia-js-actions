
import { context, getColumnByName, getMilestoneByName, getProjectByName, updateIssue } from './octokit-client';
import { parallel } from './utils';

export default async function addMilestoneToColumn() {
  const { milestone: milestoneName, project: projectName, column: columnName } = context.payload.inputs;

  const milestone = await getMilestoneByName(milestoneName);
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

  const details = { milestone: milestone.number };
  await parallel(...issues.map((issue: any) => updateIssue(issue.number, details)));
}
