@echo off
setlocal enabledelayedexpansion

# tasklist | findstr node
# taskkill /f /im node.exe

echo ========================================
echo   Stopping processes on ports 5180-5192
echo ========================================
echo.

for /l %%p in (5180,1,5192) do (
    echo [Port %%p] Checking...

    :: 精准匹配：先筛 LISTENING 行，再筛 ":端口号 "（带空格防误匹配51800）
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr /i "LISTENING" ^| findstr /c:":%%p "') do (
        set "pid=%%a"
        tasklist /fi "PID eq !pid!" /nh /fo csv 2>nul | findstr /r /c:"^[^,]" >nul
        if !errorlevel! equ 0 (
            for /f "tokens=1 delims=," %%n in ('tasklist /fi "PID eq !pid!" /nh /fo csv 2^>nul') do (
                set "proc=%%～n"
            )
            echo   ^> Killing PID !pid! (!proc!)
            taskkill /f /pid !pid! >nul 2>&1
            if !errorlevel! equ 0 (
                echo   [OK] Port %%p released
            ) else (
                echo   [FAIL] Could not kill PID !pid!
            )
        )
    )
)

echo.
echo ========================================
echo   Operation completed.
echo ========================================
pause