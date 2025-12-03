<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SystemLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logFiles = collect(glob(storage_path('logs/*.log')))
            ->map(function ($path) {
                return [
                    'name' => basename($path),
                    'path' => $path,
                    'lastModified' => filemtime($path),
                    'size' => filesize($path),
                ];
            })
            ->sortByDesc(fn ($file) => $file['lastModified'])
            ->values();

        $requested = $request->get('file');
        $activeLog = $requested
            ? $logFiles->firstWhere('name', $requested)
            : $logFiles->first();

        $entries = collect();
        $fileInfo = null;

        if ($activeLog && is_readable($activeLog['path'])) {
            $lines = @file($activeLog['path'], FILE_IGNORE_NEW_LINES) ?: [];
            $tail = array_slice($lines, -200);

            $entries = collect($tail)->map(function ($line) {
                // Try to parse "[datetime] env.LEVEL: message"
                if (preg_match('/^\[(.*?)\]\s*(.*?)\.(\w+):\s*(.*)$/', $line, $matches)) {
                    return [
                        'timestamp' => $matches[1],
                        'channel' => $matches[2],
                        'level' => strtoupper($matches[3]),
                        'message' => $matches[4],
                        'raw' => $line,
                    ];
                }

                return [
                    'timestamp' => null,
                    'channel' => null,
                    'level' => null,
                    'message' => $line,
                    'raw' => $line,
                ];
            });

            $fileInfo = [
                'name' => $activeLog['name'],
                'path' => $activeLog['path'],
                'lastModified' => date('Y-m-d H:i:s', $activeLog['lastModified']),
                'size' => $activeLog['size'],
            ];
        }

        return Inertia::render('Admin/SystemLogs', [
            'entries' => $entries,
            'file' => $fileInfo,
            'files' => $logFiles->map(function ($file) {
                return [
                    'name' => $file['name'],
                    'lastModified' => date('Y-m-d H:i:s', $file['lastModified']),
                    'size' => $file['size'],
                ];
            }),
            'activeFile' => $activeLog['name'] ?? null,
        ]);
    }
}
