/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const program = require('commander');
const octokit = require('@octokit/rest')();
const path = require('path');

program
  .option('-r, --repo <repo_name>', 'name of repository')
  .option('-t, --train <n>', 'train number', parseInt)
  .parse(process.argv);

if (! program.train || ! program.repo) {
  return program.help();
}

if (! process.env.GITHUB_API_KEY) {
  process.stderr.write('GITHUB_API_KEY environment variable must be set');
  process.exit(1);
}

octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_API_KEY
});

async function createPullRequest(trainNumber) {
  const result = await octokit.pullRequests.create({
    owner: 'mozilla',
    repo: program.repo,
    title: `chore(release): Merge train-${trainNumber} into master`,
    head: `train-${trainNumber}`,
    base: 'master'
  });
  console.log('PR URL:', result.data.html_url);
  return result;
}

createPullRequest(program.train);
