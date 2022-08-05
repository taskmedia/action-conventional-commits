<!-- start title -->

# GitHub Action:verify conventional commits

<!-- end title -->

# Description

<!-- start description -->

Check if commits of a PR match against the conventional commits specification.

See: https://conventionalcommits.org/

<!-- end description -->

# Usage

<!-- start usage -->

```yaml
- uses: taskmedia/action-conventional-commits@main
  with:
    # token to access GitHub API to receive PR commits. Can be passed in using {{
    # secrets.GITHUB_TOKEN }}
    token: ""
```

<!-- end usage -->

# Inputs

<!-- start inputs -->

| **Input**   | **Description**                                                                                     | **Default** | **Required** |
| :---------- | :-------------------------------------------------------------------------------------------------- | :---------: | :----------: |
| **`token`** | token to access GitHub API to receive PR commits. Can be passed in using {{ secrets.GITHUB_TOKEN }} |             |   **true**   |

<!-- end inputs -->

# Outputs

<!-- start outputs -->

| **Output**        | **Description**                                                                                 | **Default** | **Required** |
| :---------------- | :---------------------------------------------------------------------------------------------- | ----------- | ------------ |
| `breaking_commit` | indicates if a breaking commit was found                                                        |             |              |
| `breaking_msg`    | returns the breaking message of the last breaking commit                                        |             |              |
| `commits`         | JSON list of commits in PR                                                                      |             |              |
| `count_commits`   | count of commits in PR                                                                          |             |              |
| `invalid_commits` | indicates if this commit does not match with conventional commits (other values might be empty) |             |              |
| `version_type`    | semantic versioning indicator (patch, minor or major)                                           |             |              |

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
