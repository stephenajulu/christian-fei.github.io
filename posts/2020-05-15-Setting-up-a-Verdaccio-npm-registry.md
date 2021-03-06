---
title: "Setting up a Verdaccio npm registry"
date: 2020-05-15
layout: post.njk
tags:
  - post
  - featured
  - nodejs
  - javascript
  - npm
  - npmregistry
  - registry
image: /assets/images/posts/verdaccio.png
---

<a href="https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif"><img lazy="https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif" alt=""></a>

In case the `npm` registry goes down, it's wise to have a backup registry.

# installation

`ssh` into your server.

run `npm i -g verdaccio`.

# configuration

edit the main configuration file, located at `~/.config/verdaccio/config.yaml`.

for security reasons, replace all occurrencies of `$all` to `$authenticated`.

in vim you would run something like this:

```sh
s/\$all/\$authenticated/gc
```

`gc` for "global" and "confirm" replacement, so that you double check if you really want to replace the occurrence.

# authentication with htpasswd

set up a `~/htpasswd` file with the allowed users. you can create a config using this [secure htpasswd generator](https://hostingcanada.org/htpasswd-generator/) (it's the recommended one).

add the resulting line to the `~/htpasswd` file.

now instruct `verdaccio` to use that file, using the `auth` directive:

```yml
auth:
  htpasswd:
    file: $REPLACE_WITH_YOUR_HOME_PATH/htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    max_users: -1
```

# web interface

using the htpasswd file you have enabled registry access using the npm cli and http access to the web dashboard.

for the web dashboard to be available on the web, you need to configure the `listen` directive:

```yml
listen:
  - npm.YOUR_COMPANY.com:4873
```

use `http` if you feel so inclined. local network addresses if you're behind a proxy.

# npm client setup

you could manually add a line to the `.npmrc` file, but I used:

```sh
npm adduser --registry https://npm.YOUR_COMPANY.com:4873
```

authenticate to it and you should be good to go.

this will set the npm registry in your `.npmrc` to "https://npm.YOUR_COMPANY.com" and add a line to authenticate to it:

```sh
//npm.YOUR_COMPANY.com/:_authToken="[AUTH_TOKEN]"
```

# keep it running

personally used `pm2`, but you have more options like `forever` or `systemd`:

```sh
pm2 start --name VERDACCIO verdaccio

pm2 save
pm2 startup
```

# reverse proxy with haproxy

if haproxy terminates your SSL requests, you can put verdaccio behind that.

snippet from the haproxy.cfg, your backend for npm could look like this:

```yml
backend npm
  option forwardfor
  http-request set-header X-Forwarded-Proto https
  server npm1 npm.YOUR_COMPANY:4873 check
```

---

<small>logo from https://verdaccio.org/docs/en/logo</small>
