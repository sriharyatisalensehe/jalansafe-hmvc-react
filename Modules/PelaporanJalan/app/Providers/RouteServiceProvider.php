<?php

namespace Modules\PelaporanJalan\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    protected string $moduleName = 'PelaporanJalan';

    public function map(): void
    {
        Route::middleware(['web', 'auth'])
            ->group(module_path($this->moduleName, '/routes/web.php'));
    }
}
