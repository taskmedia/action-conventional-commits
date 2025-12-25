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
- uses: taskmedia/action-conventional-commits@v1.1.25
  with:
    # token to access GitHub API to receive PR commits
    # Default: ${{ github.token }}
    token: ""

    # skip merge commits
    # Default: true
    skip_merge: ""

    # skip revert commits
    # Default: true
    skip_revert: ""

    # allow different types in commit message
    # Default: fix|feat|revert
    types: ""
```

<!-- end usage -->

# Inputs

<!-- start inputs -->

| **Input**         | **Description**                                  | **Default**                    | **Required** |
| ----------------- | ------------------------------------------------ | ------------------------------ | ------------ |
| **`token`**       | token to access GitHub API to receive PR commits | `${{ github.token }}`          | **false**    |
| **`skip_merge`**  | skip merge commits                               | `true`                         | **false**    |
| **`skip_revert`** | skip revert commits                              | `true`                         | **false**    |
| **`types`**       | allow different types in commit message          | <code>fix\|feat\|revert</code> | **false**    |

<!-- end inputs -->

# Outputs

<!-- start outputs -->

| **Output**            | **Description**                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **`breaking_commit`** | indicates if a breaking commit was found                                                        |
| **`breaking_msg`**    | returns the breaking message of the last breaking commit                                        |
| **`commits`**         | JSON list of commits in PR                                                                      |
| **`count_commits`**   | count of commits in PR                                                                          |
| **`invalid_commits`** | indicates if this commit does not match with conventional commits (other values might be empty) |
| **`version_type`**    | semantic versioning indicator (patch, minor or major)                                           |

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
