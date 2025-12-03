<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DatabaseController extends Controller
{
    public function index(Request $request): Response
    {
        $connection = DB::connection();
        $driver = $connection->getDriverName();

        $tables = collect();

        try {
            switch ($driver) {
                case 'mysql':
                    $status = $connection->select('SHOW TABLE STATUS');
                    $tables = collect($status)->map(function ($row) {
                        $dataLength = (int) ($row->Data_length ?? 0);
                        $indexLength = (int) ($row->Index_length ?? 0);
                        return [
                            'name' => $row->Name ?? 'unknown',
                            'rows' => (int) ($row->Rows ?? 0),
                            'engine' => $row->Engine ?? null,
                            'size' => $dataLength + $indexLength,
                        ];
                    });
                    break;

                case 'pgsql':
                    $status = $connection->select("
                        SELECT
                            c.relname AS name,
                            c.reltuples::BIGINT AS rows,
                            pg_total_relation_size(c.oid) AS size
                        FROM pg_class c
                        JOIN pg_namespace n ON n.oid = c.relnamespace
                        WHERE c.relkind = 'r'
                          AND n.nspname = 'public'
                        ORDER BY c.relname;
                    ");
                    $tables = collect($status)->map(function ($row) {
                        return [
                            'name' => $row->name ?? 'unknown',
                            'rows' => (int) ($row->rows ?? 0),
                            'engine' => 'pgsql',
                            'size' => (int) ($row->size ?? 0),
                        ];
                    });
                    break;

                default: // sqlite and others
                    $status = $connection->select("
                        SELECT name
                        FROM sqlite_master
                        WHERE type = 'table'
                          AND name NOT LIKE 'sqlite_%'
                        ORDER BY name;
                    ");
                    $tables = collect($status)->map(function ($row) use ($connection) {
                        $name = $row->name ?? 'unknown';
                        $count = 0;
                        try {
                            $count = (int) ($connection->table($name)->count());
                        } catch (\Throwable $e) {
                            $count = 0;
                        }

                        return [
                            'name' => $name,
                            'rows' => $count,
                            'engine' => 'sqlite',
                            'size' => 0,
                        ];
                    });
                    break;
            }
        } catch (\Throwable $e) {
            $tables = collect();
        }

        $totals = [
            'tables' => $tables->count(),
            'rows' => $tables->sum('rows'),
            'size' => $tables->sum('size'),
            'driver' => $driver,
        ];

        return Inertia::render('Admin/Database', [
            'tables' => $tables,
            'totals' => $totals,
        ]);
    }
}
