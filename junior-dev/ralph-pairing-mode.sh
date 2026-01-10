set -e

PRD_DESCRIPTION="$1"

# Build the step 1 instruction based on whether PRD_DESCRIPTION is provided
if [ -n "$PRD_DESCRIPTION" ]; then
    STEP_1="1. Work on the following PRD item: \"$PRD_DESCRIPTION\". Work only on this feature. \\"
else
    STEP_1="1. Find the highest-priority feature to work on and work only on that feature. \\"
fi

claude --permission-mode acceptEdits "@junior-dev/prd.json @junior-dev/progress.txt \
$STEP_1
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
If, while implementing the feature, you notice the PRD is complete, prompt me to check out the feature on localhost:3000/[wherever the feature should be]. \
"