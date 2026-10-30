# Flarum GitHub OAuth

面向 **Flarum 2** 的 GitHub 登录扩展，支持在个人安全设置中手动绑定 / 解绑。

- 包名：`tacraft-sociality/flarum-github-oauth`
- 要求：Flarum `^2.0.2`、PHP `^8.3`

## 功能

- 登录 / 注册弹窗中的「使用 GitHub 登录」按钮
- 首次登录自动预填用户名、头像和已验证邮箱
- 已绑定用户点击后直接登录
- 个人资料 → 安全设置中的「GitHub 账号」面板：绑定、更换、解绑

## 安装

```sh
composer require tacraft-sociality/flarum-github-oauth
php flarum cache:clear
```

## 配置

1. 打开 GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**。
2. **Authorization callback URL** 填：

   ```text
   https://你的域名/github-oauth/callback
   ```

3. 创建后把 **Client ID** 和 **Client Secret** 填到 Flarum 后台的 GitHub OAuth 设置里。

回调地址固定为 `/github-oauth/callback`，不需要使用 `/auth/github`。

## 账号绑定

登录后进入 **个人资料 → 安全设置**，页面里会多出一个「GitHub 账号」区域：

- 未绑定：显示「绑定 GitHub 账号」按钮
- 已绑定：显示账号标识、绑定时间，可更换或解绑
- 一个 GitHub 账号只能绑定一个论坛账号
- 解绑不会退出当前登录；如果邮箱匹配，下次登录可能会自动重新关联

如果之前用 `fof/oauth` 登录过 GitHub，绑定数据（provider 名 `github`）可以直接沿用；但请停用 `fof/oauth` 的 GitHub 按钮，避免出现两个入口。

## 许可

MIT
