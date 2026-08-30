#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

for forbidden in 'service_role' 'SUPABASE_SERVICE_ROLE' 'sk-' 'BEGIN PRIVATE KEY' 'password='; do
  if grep -RIn --exclude='scripts_verify_clean_room.sh' --exclude='README.md' --exclude='PUBLIC_RELEASE_CHECKLIST.md' --exclude='.gitignore' -- "$forbidden" . >/tmp/aizoya_scan_hits 2>/dev/null; then
    echo "HOLD: forbidden pattern detected: $forbidden"
    cat /tmp/aizoya_scan_hits
    exit 1
  fi
done

if find . -mindepth 2 -type d -name .git -print -quit | grep -q .; then
  echo 'HOLD: nested Git ancestry detected in clean-room source folder.'
  exit 1
fi

if find . -maxdepth 1 -type f \( -name '.env' -o -name '.env.*' \) -print -quit | grep -q .; then
  echo 'HOLD: environment file present in source folder.'
  exit 1
fi

echo 'Clean-room static scan passed.'
