#!/usr/bin/env bash
# preToolUse hook: denies writes outside allowed paths

INPUT=$(cat)

if [ -z "$INPUT" ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

TOOL=""
if command -v jq &>/dev/null; then
  TOOL=$(echo "$INPUT" | jq -r '.tool // empty')
else
  TOOL=$(echo "$INPUT" | grep -o '"tool"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
fi

if [ -z "$TOOL" ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

WRITE_TOOLS="edit Write MultiEdit NotebookEdit"
IS_WRITE=false
for t in $WRITE_TOOLS; do
  if [ "$TOOL" = "$t" ]; then
    IS_WRITE=true
    break
  fi
done

if [ "$IS_WRITE" = false ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

FILEPATH=""
if command -v jq &>/dev/null; then
  FILEPATH=$(echo "$INPUT" | jq -r '.path // empty')
else
  FILEPATH=$(echo "$INPUT" | grep -o '"path"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
fi

if [ -z "$FILEPATH" ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

# Allow writes to screen components and the screen registry/imports
case "$FILEPATH" in
  src/app/screens/*|./src/app/screens/*)
    echo '{"permissionDecision": "allow"}'
    ;;
  *)
    echo '{"permissionDecision": "deny", "permissionDecisionReason": "Writes are only permitted in src/app/screens/. To modify other files, ask explicitly and confirm."}'
    ;;
esac

exit 0
