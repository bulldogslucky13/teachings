set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <iterations>"
    exit 1
fi

for((i=1; i<=$1; i++)); do
    echo "Iteration $i"
    echo "--------------------------------"
    result=$(claude --permission-mode acceptEdits "@junior-dev/prd.json @junior-dev/progress.txt \
1. Find the highest-priority feature to work on and work only on that feature. \
2. To verify your changes, utilize our local mcp server. You should have access to it already through next-devtools. Also, check that the types check via npm run typecheck. Also verify linting passes via npm run lint. All three should be verified and passing before you move on. \
3. Update the PRD with the work that was done. \
4. Append your progress to the progress.txt file. \
After completing each task, append to progress.txt: \
- Task completed and PRD item reference \
- Key decisions made and reasoning \
- Any blockers or notes for next iteration \
Keep entries concise. Sacrifice grammar for the sake of concision. This file helps future iterations skip exploration. \
5. Make a git commit of that feature. \
ONLY WORK ON A SINGLE FEATURE. \
If, while implementing the feature, you notice the PRD is complete, output <promise>COMPLETE</promise>. \
")

echo "$result"

if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "The PRD is complete. Exiting."
    exit 0
fi
done