# RESTful API Server

## Local Development

```bash
# configure environment variables
cp .env.example .env

# install dependencies
npm install

# start server with auto-reload
node ace serve --watch
```

## Production Deployment

System requirements:

- GNU/Linux
- Systemd, included in most modern GNU/Linux distributions
- Node.js 16+
- MySQL/MariaDB/Postgres
- Python 3
- [Certbot](https://certbot.eff.org/)

Initial deployment (Linux):

```bash
# generate https certificates
sudo certbot certonly

# configure environment variables
cp .env.example .env
vi .env

# install dependencies
npm install

# build the server
node ace build --production

# daemon process manager to keep your app always online
sudo npm i -g pm2
sudo pm2 startup
sudo pm2 start build/server.js
sudo pm2 save
sudo systemctl restart pm2-root
```

Regular update:

```bash
# install dependencies
npm install

# build the server
node ace build --production

# restart daemon process
sudo systemctl restart pm2-root
```

## Documentation

- [adonis-api-template](https://github.com/guoyunhe/adonis-api-template) - the template
- [AdonisJS](https://docs.adonisjs.com/) - the framework
- [PM2](https://pm2.keymetrics.io/) - the daemon process manager
- [Certbot](https://certbot.eff.org/) - get free HTTPS certificates
