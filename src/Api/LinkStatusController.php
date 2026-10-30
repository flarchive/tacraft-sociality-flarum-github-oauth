<?php

declare(strict_types=1);

namespace TacraftSociality\GithubOAuth\Api;

use Flarum\Http\RequestUtil;
use Flarum\User\LoginProvider;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Reports whether the current user has a GitHub account linked.
 */
class LinkStatusController implements RequestHandlerInterface
{
    public const PROVIDER = 'github';

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        /** @var LoginProvider|null $provider */
        $provider = $actor->loginProviders()
            ->where('provider', self::PROVIDER)
            ->first();

        return new JsonResponse([
            'linked' => $provider !== null,
            'identifier' => $provider?->identifier,
            'createdAt' => $provider?->created_at?->toIso8601String(),
            'lastLoginAt' => $provider?->last_login_at?->toIso8601String(),
        ]);
    }
}
