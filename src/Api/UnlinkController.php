<?php

declare(strict_types=1);

namespace TacraftSociality\GithubOAuth\Api;

use Flarum\Http\RequestUtil;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Removes the GitHub account linked to the current user.
 */
class UnlinkController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $removed = $actor->loginProviders()
            ->where('provider', LinkStatusController::PROVIDER)
            ->delete();

        return new JsonResponse([
            'linked' => false,
            'removed' => $removed,
        ]);
    }
}
