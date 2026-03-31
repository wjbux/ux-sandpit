#!/usr/bin/env bash
# preToolUse hook: denies writes outside /screens/ and /components/

INPUT=$(cat)

# If stdin is empty, allow
if [ -z "$INPUT" ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

# Extract tool name
TOOL=""
if command -v jq &>/dev/null; then
  TOOL=$(echo "$INPUT" | jq -r '.tool // empty')
else
  TOOL=$(echo "$INPUT" | grep -o '"tool"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
fi

# If tool cannot be determined, allow
if [ -z "$TOOL" ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

# Only check file-writing tools
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

# Extract file path
FILEPATH=""
if command -v jq &>/dev/null; then
  FILEPATH=$(echo "$INPUT" | jq -r '.path // empty')
else
  FILEPATH=$(echo "$INPUT" | grep -o '"path"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')
fi

# If no path found, allow
if [ -z "$FILEPATH" ]; then
  echo '{"permissionDecision": "allow"}'
  exit 0
fi

# Check if path starts with allowed directories
case "$FILEPATH" in
  screens/*|./screens/*|components/*|./components/*)
    echo '{"permissionDecision": "allow"}'
    ;;
  *)
    echo '{"permissionDecision": "deny", "permissionDecisionReason": "Writes are only permitted in /screens/ and /components/. To modify project config or Copilot instructions, ask explicitly and confirm."}'
    ;;
esac

exit 0
