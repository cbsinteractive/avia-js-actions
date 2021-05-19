import { context, getColumnByName, getProjectByName, moveExistingCard, createCard } from './octokit-client';
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
  if (!toProject) {
    console.log('to project not found');
    return;
  }

  const toColumn = await getColumnByName(toColumnName, toProject.number);
  if (!toColumn){
    console.log('to column not found');
    return;
  }

  const issues = fromColumn.cards.map((card: any) => card.content);
  if (!issues?.length) {
    console.log('no issues');
    return;
  }
  
  //TODO
  //Check if issue is already in the TO column? 
  //Remove project from a card?


  function processCardAction(issue:any) {

    try {
      createCard(toColumn.id, issue.id);
    } catch(e) {
      console.log('testing', toColumn.id, issue.id);
      moveExistingCard(toColumn.id, issue.id);
    }


    //moveExistingCard - need to modify 
  }


  await parallel(...issues.map((issue: any) => processCardAction(issue)));

  //issues.forEach? ^^
}
