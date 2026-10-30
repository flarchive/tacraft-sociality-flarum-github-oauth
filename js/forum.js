import app from 'flarum/forum/app';
import { extend as extendMethod } from 'flarum/common/extend';
import LogInButtons from 'flarum/forum/components/LogInButtons';

import { AUTH_PATH, ENABLED_ATTRIBUTE } from './src/common/constants';
import GithubLinkedAccount from './src/forum/components/GithubLinkedAccount';
import githubLogo from './src/forum/components/GithubIcon';
import { handleAuthRedirect } from './src/forum/handleAuthRedirect';

function logInUrl() {
  const baseUrl = String(app.forum.attribute('baseUrl') ?? '').replace(/\/+$/, '');
  const current = `${window.location.pathname}${window.location.search}`;
  const returnTo = current.startsWith(AUTH_PATH) ? '/' : current;

  return `${baseUrl}${AUTH_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
}

function logInButton() {
  return (
    <a className="Button LogInButton LogInButton--github" href={logInUrl()}>
      {githubLogo('Button-icon GithubOAuth-icon')}
      <span className="Button-label">
        <span className="Button-labelText">{app.translator.trans('tacraft-sociality-github-oauth.forum.log_in_with')}</span>
      </span>
    </a>
  );
}

export const extend = [
  {
    extend() {
      extendMethod(LogInButtons.prototype, 'items', function (items) {
        if (!app.forum.attribute(ENABLED_ATTRIBUTE)) {
          return;
        }

        items.add('github-oauth', logInButton());
      });

      // Add the link/unlink panel to the user's own security settings, below
      // the QQ (100), Blessing Skin (99) and Microsoft (98) sections.
      extendMethod('flarum/forum/components/UserSecurityPage', 'settingsItems', function (items) {
        const user = this.user;

        if (!user || user.id() !== app.session.user?.id() || !app.forum.attribute(ENABLED_ATTRIBUTE)) {
          return;
        }

        items.add('githubOAuthLinkedAccount', <GithubLinkedAccount user={user} />, 97);
      });

      app.beforeMount(() => {
        void handleAuthRedirect();
      });
    },
  },
];
