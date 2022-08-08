import * as github from '@actions/github'
import * as core from '@actions/core'
import * as cc from './conventionalcommit'

async function run(): Promise<void> {
  try {
    const gh_token = core.getInput('token')
    const octokit = github.getOctokit(gh_token)

    // replace semicolon with vertical bar to fit regex syntax
    // not directly used because README markdown table would break
    const types = core.getInput('types').replace(";","|")

    const {data: commit_list} = await octokit.rest.pulls.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.issue.number
    })

    let hasInvalidCommits = false
    let versionType = 'patch'
    let hasBreakingCommit = false
    let breaking_msg = ''

    const commits: cc.conventionalcommit[] = []

    for (const c of commit_list) {
      const commit = cc.checkCommit(c.commit.message, types)

      if (commit.invalid) {
        hasInvalidCommits = true
        core.info(`❌ ${commit.full}`)
      } else {
        core.info(`✅ ${commit.getShortMessage()}`)
      }

      if (commit.breaking) {
        hasBreakingCommit = true
        versionType = 'major'
        breaking_msg = commit.breaking_change
      }

      if (commit.type === 'feat' && versionType !== 'major') {
        versionType = 'minor'
      }

      commits.push(commit)
    }

    core.setOutput('breaking_commit', hasBreakingCommit)
    core.setOutput('breaking_msg', breaking_msg)
    core.setOutput('commits', JSON.stringify(commits))
    core.setOutput('count_commits', commits.length)
    core.setOutput('invalid_commits', hasInvalidCommits)
    core.setOutput('version_type', versionType)

    if (hasInvalidCommits) {
      core.setFailed('at least one commit is invalid')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
