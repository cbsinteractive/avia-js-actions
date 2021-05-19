import { context, getColumnByName, getProjectByName } from './octokit-client';

export default async function columnFlush() {
  const {
    fromProject: fromProjectName,
    fromColumn: fromColumnName,
    toProject: toProjectName,
    toColumn: toColumnName
  } = context.payload.inputs;

  const fromProject = await getProjectByName(fromProjectName);
  const fromColumn = await getColumnByName(fromColumnName, fromProject.number);
  const toProject = await getProjectByName(toProjectName);
  const toColumn = await getColumnByName(toColumnName, toProject.number);

  console.log('hello world', fromProject, toProject, fromColumn, toColumn);

  if (!fromColumn || !toColumn) {
    console.log('no from or no to column');
    return;
  }


  





  // inputs: {
  //   fromColumn: 'Ready for QA',
  //   fromProject: 'Avia JS Sprint Board',
  //   toColumn: 'Ready for Test',
  //   toProject: 'Avia JS QA Board'
  // }


}
