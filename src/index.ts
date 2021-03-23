import core from '@actions/core';
import github from '@actions/github';

async function run() {
  try {
    const token = core.getInput('token') || process.env.TOKEN;
    const octokit = github.getOctokit(token);
    const { data: pullRequests } = await octokit.pulls.list({
      owner: 'cbsinteractive',
      repo: 'avia-js',
    });

    console.log(pullRequests);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
