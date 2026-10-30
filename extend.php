<?php

declare(strict_types=1);

namespace TacraftSociality\GithubOAuth;

use Flarum\Extend;
use Flarum\Settings\SettingsRepositoryInterface;
use TacraftSociality\GithubOAuth\Forum\Controllers\GithubAuthController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Routes('forum'))
        ->get('/github-oauth/callback', 'github-oauth.callback', GithubAuthController::class),

    (new Extend\Routes('api'))
        ->get('/github-oauth/link', 'github-oauth.link.show', Api\LinkStatusController::class)
        ->delete('/github-oauth/link', 'github-oauth.link.delete', Api\UnlinkController::class),

    (new Extend\Settings())
        ->default(Settings::CLIENT_ID, '')
        ->default(Settings::CLIENT_SECRET, '')
        ->serializeToForum('githubOAuthEnabled', Settings::CLIENT_ID, function ($value): bool {
            if (! is_string($value) || trim($value) === '') {
                return false;
            }

            $secret = resolve(SettingsRepositoryInterface::class)->get(Settings::CLIENT_SECRET, '');

            return is_string($secret) && trim($secret) !== '';
        }),
];
