import { context, getColumnByName, getProjectByName, createCard } from './octokit-client';
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
    console.log('form project not found');
    return;
  }

  const fromColumn = await getColumnByName(fromColumnName, fromProject.number);
  if (!fromColumn){
    console.log('from column not found');
    return;
  }

  const toProject = await getProjectByName(toProjectName);
  if (!toProject){
    console.log('to project not found');
    return;
  }

  const toColumn = await getColumnByName(toColumnName, toProject.number);
  
  //console.log('xxx', toColumn) //{ id: 13304483, name: 'Ready for Test', cards: [] }

  if (!toColumn){
    console.log('to column not found');
    return;
  }

  const issues = fromColumn.cards.map((card: any) => card.content);
  if (!issues?.length) {
    console.log('no issues');
    return;
  }

  //console.log('xxx', issues);
  /*
  [
    { id: 838158920, number: 8 },
    { id: 838158871, number: 7 },
    { id: 823400650, number: 4 }
  ]
  */

  await parallel(...issues.map((issue: any) => createCard(toColumn.id, issue.id)));

}
