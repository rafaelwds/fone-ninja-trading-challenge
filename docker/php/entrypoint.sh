#!/bin/sh
set -e

cd /var/www/html

if [ ! -f vendor/autoload.php ]; then
    echo "Instalando dependencias do Composer..."
    composer install --no-interaction --optimize-autoloader
fi

if [ ! -f .env ]; then
    echo "Criando .env a partir de .env.example..."
    cp .env.example .env
fi

if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo "Gerando APP_KEY..."
    php artisan key:generate --force --ansi
fi

mkdir -p storage/framework/{cache,sessions,testing,views} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

php artisan config:clear >/dev/null 2>&1 || true

exec "$@"
