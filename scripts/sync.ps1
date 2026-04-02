# GenMark GitHub Sync Script
# This script handles staging, committing, and pushing all changes.

$CommitMsg = $args[0]
if (-not $CommitMsg) {
    $CommitMsg = "chore: automated sync at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

Write-Host "--- Syncing GenMark to GitHub ---" -ForegroundColor Cyan

# Stage all changes (including untracked files)
Write-Host "Staging changes..." -ForegroundColor Gray
git add -A

# Check if there are any changes to commit
$Status = git status --porcelain
if (-not $Status) {
    Write-Host "No changes to sync." -ForegroundColor Green
    exit 0
}

# Commit
Write-Host "Committing changes with message: '$CommitMsg'" -ForegroundColor Gray
git commit -m $CommitMsg

# Push
Write-Host "Pushing to remote repository..." -ForegroundColor Gray
git push origin $(git rev-parse --abbrev-ref HEAD)

Write-Host "Done!" -ForegroundColor Green
