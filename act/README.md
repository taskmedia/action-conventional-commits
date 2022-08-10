# Test with act

To test this action locally use [nektos/act](https://github.com/nektos/act).

```bash
$ npm run build && npm run package
$ act pull_request -j 'act-test' -e act/pull-request.json --secret-file act/local.secrets
```
