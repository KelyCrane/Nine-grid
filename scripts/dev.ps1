$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $taskRoot
$env:TEMP=Join-Path $taskRoot '.storage\tmp'
$env:TMP=$env:TEMP
$env:npm_config_cache=Join-Path $taskRoot '.storage\cache\npm'
$env:npm_config_userconfig=Join-Path $taskRoot '.npmrc'
$env:npm_config_update_notifier='false'
New-Item -ItemType Directory -Path $env:TEMP,$env:npm_config_cache -Force | Out-Null
npm.cmd run dev
