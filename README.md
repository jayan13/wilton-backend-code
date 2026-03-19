# WILTON APP BACKEND
wilton backend new

## Checking the app

```bash
# Check Format
$ yarn format

# Check Types
$ yarn check-types

# Check ESLint
$ yarn check-lint

# Check All
$ yarn test-all
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Running the app

```bash
# Check Offline Serverless
$ yarn start:sls

# Deploy production mode
$ yarn deploy
```

## Makefile git add commit push github

### Semantic Commit Messages (Mandatory for this app)

See how a minor change to your commit message style can make you a better programmer.

```bash
Format: <type>(<scope>): <subject>

<scope> is optional
```

**Examples:**

```bash
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, test, build, ci, perf or revert 
```

**More Examples: Please Folloew this Keyword to commit message**

- **chore:** (updating grunt tasks etc; no production code change)
- **docs:** (changes to the documentation)
- **feat:** (new feature for the user, not a new feature for build script)
- **fix:** (bug fix for the user, not a fix to a build script)
- **refactor:** (refactoring production code, eg. renaming a variable)
- **style:** (formatting, missing semi colons, etc; no production code change)
- **test:** (adding missing tests, refactoring tests; no production code change)
- **build:** (changes that affect the build system or external dependencies)
- **ci:** (continuous integration related)
- **perf:** (performance improvements)
- **revert:** (reverts a previous commit)

```bash
# Git ADD file
$ git add file1 file2

# Git Commit file
$ git commit -m "fix: Add existing file"

# Git Push file
$ git push origin branch-name

```
