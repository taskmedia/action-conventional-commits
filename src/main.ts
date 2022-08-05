import * as github from '@actions/github'
import * as core from '@actions/core'
import * as cc from './conventionalcommit'

async function run(): Promise<void> {
  try {
    const gh_token = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit("gh_token");

    const { data: commit_list } = await octokit.rest.pulls.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.issue.number
    });

    let hasInvalidCommits: boolean = false;
    let versionType: string = "patch";
    let hasBreakingCommit: boolean = false;

    let commits: Array<cc.conventionalcommit> = [];

    for (const c of commit_list) {
      // console.log(commit.commit.message);
      let commit = cc.checkCommit(c.commit.message);

      if (commit.invalid) {
        hasInvalidCommits = true;
        console.log("❌ "+ commit.full);
      } else {
        console.log("✅ "+ commit.getShortMessage());
      }

      if (commit.breaking) {
        hasBreakingCommit = true;
        versionType = "major";
      }

      if (commit.type == "feat" && versionType != "major") {
        versionType = "minor";
      }

      commits.push(commit);
    }

    core.setOutput("breaking_commit", hasBreakingCommit);
    core.setOutput("commits", JSON.stringify(commits));
    core.setOutput("count_commits", commits.length);
    core.setOutput("invalid_commits", hasInvalidCommits);
    core.setOutput("version_type", versionType);

    if (hasInvalidCommits) {
      core.setFailed("at least one commit is invalid");
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
