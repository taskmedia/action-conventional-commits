<!-- start title -->

# GitHub Action: verify conventional commits

<!-- end title -->

# Description

<!-- start description -->

Check if commits of a PR match against the conventional commits specification.

See: https://conventionalcommits.org/

<!-- end description -->

# Usage

<!-- start usage -->

```yaml
- uses: taskmedia/action-conventional-commits@v1.0.0
  with:
    # token to access GitHub API to receive PR commits
    # Default: ${{ github.token }}
    token: ""

    # skip merge commits
    # Default: true
    skip_merge: ""

    # skip squash commits
    # Default: true
    skip_squash: ""

    # allow different types in commit message
    # Default: fix|feat|revert
    types: ""
```

<!-- end usage -->

# Inputs

<!-- start inputs -->

| **Input**                    | **Description**                                  | **Default**                      | **Required** |
| ---------------------------- | ------------------------------------------------ | -------------------------------- | ------------ |
| **<code>token</code>**       | token to access GitHub API to receive PR commits | <code>${{ github.token }}</code> | **false**    |
| **<code>skip_merge</code>**  | skip merge commits                               | <code>true</code>                | **false**    |
| **<code>skip_squash</code>** | skip squash commits                              | <code>true</code>                | **false**    |
| **<code>types</code>**       | allow different types in commit message          | <code>fix\|feat\|revert</code>   | **false**    |

<!-- end inputs -->

# Outputs

<!-- start outputs -->

| \***\*Output\*\***           | \***\*Description\*\***                                                                         | \***\*Default\*\*** | \***\*Required\*\*** |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ------------------- | -------------------- |
| <code>breaking_commit</code> | indicates if a breaking commit was found                                                        | undefined           | undefined            |
| <code>breaking_msg</code>    | returns the breaking message of the last breaking commit                                        | undefined           | undefined            |
| <code>commits</code>         | JSON list of commits in PR                                                                      | undefined           | undefined            |
| <code>count_commits</code>   | count of commits in PR                                                                          | undefined           | undefined            |
| <code>invalid_commits</code> | indicates if this commit does not match with conventional commits (other values might be empty) | undefined           | undefined            |
| <code>version_type</code>    | semantic versioning indicator (patch, minor or major)                                           | undefined           | undefined            |

<!-- end outputs -->

### JSON format example output `commits`

```json
[
  {
    "invalid": false,
    "full": "fix(app)!: changed something\n\nThis is a big change\r\n\r\nBREAKING CHANGE: API changed",
    "type": "fix",
    "breaking": true,
    "scope": "app",
    "message": "changed something",
    "body": "This is a big change",
    "breaking_change": "API changed"
  }
]
```
