set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <iterations>"
    exit 1
fi

for((i=1; i<=$1; i++)); do
    echo "Iteration $i"
    echo "--------------------------------"
    result=$(claude --stream --permission-mode acceptEdits -p "@junior-dev/prd.json @junior-dev/progress.txt \
1. Find the highest-priority feature to work on and work only on that feature. \
2. To verify your changes, utilize our local mcp server at http://localhost:3000/_next/mcp. Also, check that the types check via npm run typecheck. Also verify linting passes via npm run lint. \
3. Update the PRD with the work that was done. \
4. Append your progress to the progress.txt file. \
Use this to leave a note for the next person working in the codebase. \
5. Make a fit commit of that feature. \
ONLY WORK ON A SINGLE FEATURE. \
If, while implementing the feature, you notice the PRD is complete, output <promise>COMPLETE</promise>. \
")

echo "$result"

if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "The PRD is complete. Exiting."
    exit 0
fi
done