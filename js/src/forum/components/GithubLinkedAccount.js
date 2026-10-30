import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import FieldSet from 'flarum/common/components/FieldSet';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import humanTime from 'flarum/common/helpers/humanTime';
import extractText from 'flarum/common/utils/extractText';

import { AUTH_PATH, ENABLED_ATTRIBUTE, LINK_STATUS_ENDPOINT } from '../../common/constants';
import githubLogo from './GithubIcon';

const PREFIX = 'tacraft-sociality-github-oauth.forum.link';

function trans(key, params = {}) {
  return app.translator.trans(`${PREFIX}.${key}`, params);
}

/**
 * Shows whether the current user has linked a GitHub account, and lets them
 * link or unlink one from their security settings.
 */
export default class GithubLinkedAccount extends Component {
  state = {
    loading: true,
    failed: false,
    unlinking: false,
    status: null,
  };

  oninit(vnode) {
    super.oninit(vnode);

    void this.load();
  }

  view() {
    return (
      <FieldSet className="GithubOAuth-linkedAccount" label={trans('heading')}>
        <p className="helpText">{trans('help')}</p>
        {this.state.loading ? <LoadingIndicator /> : this.state.failed ? this.errorView() : this.accountView()}
      </FieldSet>
    );
  }

  errorView() {
    return (
      <div className="GithubOAuth-Account-errors">
        <p className="helpText">{trans('load_failed')}</p>
        <Button className="Button" onclick={() => this.load()}>
          {trans('retry')}
        </Button>
      </div>
    );
  }

  accountView() {
    const linked = this.state.status?.linked === true;

    return (
      <div className={`GithubOAuth-Account ${linked ? 'GithubOAuth-Account--linked' : 'GithubOAuth-Account--unlinked'}`}>
        <div className="GithubOAuth-Account-icon">{githubLogo('GithubOAuth-icon GithubOAuth-Account-logo')}</div>
        <div className="GithubOAuth-Account-info">
          <span className="GithubOAuth-Account-name">{trans('name')}</span>
          <span className="GithubOAuth-Account-status">{trans(linked ? 'status_linked' : 'status_unlinked')}</span>
          {linked ? this.linkedMeta() : null}
        </div>
        <div className="GithubOAuth-Account-actions">{linked ? this.linkedActions() : this.unlinkedActions()}</div>
      </div>
    );
  }

  linkedMeta() {
    const status = this.state.status;
    const identifier = status?.identifier;
    const createdAt = status?.createdAt;

    if (!identifier && !createdAt) {
      return null;
    }

    return (
      <span className="GithubOAuth-Account-meta">
        {identifier ? trans('identifier', { identifier }) : null}
        {identifier && createdAt ? ' · ' : null}
        {createdAt ? trans('linked_at', { time: humanTime(new Date(createdAt)) }) : null}
      </span>
    );
  }

  unlinkedActions() {
    return (
      <Button className="Button GithubOAuth-Account-bind" onclick={() => this.startLink()}>
        {trans('bind_button')}
      </Button>
    );
  }

  linkedActions() {
    return [
      <Button className="Button" onclick={() => this.startLink()} disabled={this.state.unlinking}>
        {trans('rebind_button')}
      </Button>,
      <Button className="Button" onclick={() => this.unlink()} loading={this.state.unlinking}>
        {trans('unbind_button')}
      </Button>,
    ];
  }

  startLink() {
    const baseUrl = String(app.forum.attribute('baseUrl') ?? '').replace(/\/+$/, '');
    const returnTo = `${window.location.pathname}${window.location.search}`;

    window.location.href = `${baseUrl}${AUTH_PATH}?link=1&returnTo=${encodeURIComponent(returnTo)}`;
  }

  async unlink() {
    if (!confirm(extractText(trans('unlink_confirm')))) {
      return;
    }

    this.state.unlinking = true;
    m.redraw();

    try {
      await app.request({
        method: 'DELETE',
        url: `${app.forum.attribute('apiUrl')}${LINK_STATUS_ENDPOINT}`,
      });

      this.state.status = {
        linked: false,
        identifier: null,
        createdAt: null,
        lastLoginAt: null,
      };

      app.alerts.show({ type: 'success' }, trans('unlinked_success'));
    } catch {
      app.alerts.show({ type: 'error' }, trans('unlink_failed'));
    } finally {
      this.state.unlinking = false;
      m.redraw();
    }
  }

  async load() {
    if (!app.forum.attribute(ENABLED_ATTRIBUTE)) {
      this.state.loading = false;
      this.state.failed = false;

      return;
    }

    this.state.loading = true;
    this.state.failed = false;
    m.redraw();

    try {
      this.state.status = await app.request({
        method: 'GET',
        url: `${app.forum.attribute('apiUrl')}${LINK_STATUS_ENDPOINT}`,
      });
    } catch {
      this.state.failed = true;
    } finally {
      this.state.loading = false;
      m.redraw();
    }
  }
}
