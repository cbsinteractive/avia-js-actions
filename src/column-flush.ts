import { context, getColumnByName, getProjectByName, moveExistingCard } from './octokit-client';
import { parallel } from './utils';

export default async function columnFlush() {
  const {
    fromProject: fromProjectName,
    fromColumn: fromColumnName,
    toProject: toProjectName,
    toColumn: toColumnName
  } = context.payload.inputs;

  const fromProject = await getProjectByName(fromProjectName);
  if (!fromProject){
    console.log('no from project');
    return;
  }

  const fromColumn = await getColumnByName(fromColumnName, fromProject.number);
  if (!fromColumn){
    console.log('no from column');
    return;
  }

  const toProject = await getProjectByName(toProjectName);
  if (!toProject){
    console.log('no to project');
    return;
  }

  const toColumn = await getColumnByName(toColumnName, toProject.number);
  console.log('xxx', toColumn)
  if (!toColumn){
    console.log('no to column');
    return;
  }

  const issues = fromColumn.cards.map((card: any) => card.content);
  if (!issues?.length) {
    console.log('no issues');
    return;
  }

  console.log('hello world', issues);

  await parallel(...issues.map((issue: any) => moveExistingCard(toColumn.id, issue.number)));
  


  /*

  inputs: {
    fromColumn: 'Ready for QA',
    fromProject: 'Avia JS Sprint Board',
    toColumn: 'Ready for Test',
    toProject: 'Avia JS QA Board'
  }

  ....

  Project: Avia JS Sprint Board
` Column: Ready for QA
  Project: Avia JS QA Board
  Column: Ready for Test

  {
    number: 2,
    databaseId: 11928089,
    name: 'Avia JS Sprint Board',
    url: 'https://github.com/cbsinteractive/github-actions-test/projects/2'
  } {
    number: 3,
    databaseId: 11930223,
    name: 'Avia JS QA Board',
    url: 'https://github.com/cbsinteractive/github-actions-test/projects/3'
  } {
    id: 13299461,
    name: 'Ready for QA',
    cards: [
      { id: 57470801, content: [Object] },
      { id: 57470813, content: [Object] },
      { id: 56561432, content: [Object] }
    ]
  } 
  { id: 13304483, name: 'Ready for Test', cards: [] }`
   */
}
