#!/bin/bash
# Discord Notification Script for Gemini CLI

WEBHOOK_URL="https://discord.com/api/webhooks/1467138976627298337/7TRjwaA6otrA4Q48EChhTymFuLrs47C6okgeSIshDNEtXQWYIcsoaosGLEin8dnJxK6j"
CLI_SESSION_ID="${GEMINI_SESSION_ID:-unknown_session}"

# Read event data from stdin if available
if [ ! -t 0 ]; then
  EVENT_DATA=$(cat)
  
  # Check if it's a SessionEnd event
  SESSION_END_REASON=$(echo "$EVENT_DATA" | jq -r '.reason // empty')
  
  if [ -n "$SESSION_END_REASON" ]; then
    MESSAGE="🚀 **Gemini CLI Session Ended**
**Session ID:** 
${CLI_SESSION_ID}
**Reason:** ${SESSION_END_REASON}"
  else
    # Check if it's an AfterAgent event (contains prompt and prompt_response)
    PROMPT=$(echo "$EVENT_DATA" | jq -r '.prompt // empty')
    if [[ "$PROMPT" == *"Execute the implementation plan"* ]]; then
      MESSAGE="✅ **Speckit Implementation Turn Completed**
**Session ID:** 
${CLI_SESSION_ID}

The implementation turn for the current feature has finished."
    else
      MESSAGE="🤖 **Gemini Agent Turn Completed**
**Session ID:** 
${CLI_SESSION_ID}"
    fi
  fi
else
  # Manual execution or simple message from command line arg
  MESSAGE="🔔 **Gemini CLI Notification**
**Session ID:** 
${CLI_SESSION_ID}
**Content:** ${1:-"Task completed!"}"
fi

# Use jq -c to safely construct compact JSON payload
PAYLOAD=$(jq -nc --arg content "$MESSAGE" '{content: $content}')

curl -s -H "Content-Type: application/json" \
     -X POST \
     --data-binary "$PAYLOAD" \
     "$WEBHOOK_URL"
