# ─── TripVault Quick Push Script ───────────────────────────────────────────
# Usage:  .\push.ps1                      → auto commit message with timestamp
# Usage:  .\push.ps1 "your message here" → custom commit message

param(
    [string]$Message = ""
)

# Auto-generate message if none provided
if (-not $Message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message = "chore: update files [$timestamp]"
}

Write-Host ""
Write-Host "🔍 Checking git status..." -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "📦 Staging all changes..." -ForegroundColor Cyan
git add README.md client/ server/index.js server/models/ server/middleware/ server/package.json server/package-lock.json server/routes/ 2>$null

Write-Host ""
Write-Host "💾 Committing: $Message" -ForegroundColor Cyan
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nothing to commit or commit failed." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "   https://github.com/karthikrchintamani-maker/Tripvault" -ForegroundColor DarkGray
} else {
    Write-Host ""
    Write-Host "⚠️  Push failed. Trying pull-rebase first..." -ForegroundColor Yellow
    git stash
    git pull --rebase origin main
    git stash pop
    git push origin main
    Write-Host "✅ Done!" -ForegroundColor Green
}
