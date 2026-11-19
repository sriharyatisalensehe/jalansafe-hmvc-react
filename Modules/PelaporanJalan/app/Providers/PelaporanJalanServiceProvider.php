<?php

namespace Modules\PelaporanJalan\Providers;

use Illuminate\Support\ServiceProvider;

class PelaporanJalanServiceProvider extends ServiceProvider
{
    protected string $moduleName = 'PelaporanJalan';
    protected string $moduleNameLower = 'pelaporanjalan';

    public function boot(): void
    {
        $this->registerConfig();
        $this->loadMigrationsFrom(module_path($this->moduleName, 'database/migrations'));
    }

    public function register(): void
    {
        $this->app->register(RouteServiceProvider::class);
    }

    protected function registerConfig(): void
    {
        $this->publishes([
            module_path($this->moduleName, 'config/config.php') => config_path($this->moduleNameLower . '.php'),
        ], 'config');
        $this->mergeConfigFrom(
            module_path($this->moduleName, 'config/config.php'), $this->moduleNameLower
        );
    }
}
