# EXIT BQUOTE MODE AND RUN CLEAN PUSH

## You're stuck in multi-line input mode!

The `bquote>` prompt means your terminal is waiting for you to complete a command.

### STEP 1: Exit bquote mode
Press `Ctrl + C` to cancel and return to normal prompt

### STEP 2: Close terminal and open fresh one
1. Close current terminal window completely
2. Open new terminal window
3. You should see normal prompt: `stephenpashoian@Mac ~ %`

### STEP 3: Run commands ONE AT A TIME

```bash
cd ~/Desktop/secure-payment-app
```
*(Press Enter, wait for prompt)*

```bash
git checkout --orphan latest_branch
```
*(Press Enter, wait for prompt)*

```bash
git add -A
```
*(Press Enter, wait for prompt)*

```bash
git commit -m "Clean project structure"
```
*(Press Enter, wait for prompt)*

```bash
git branch -D main
```
*(Press Enter, wait for prompt)*

```bash
git branch -m main
```
*(Press Enter, wait for prompt)*

```bash
git push -f origin main
```
*(Press Enter, complete!)*

## Important:
- Run each command separately
- Wait for normal prompt before next command
- Don't copy/paste multiple lines at once
