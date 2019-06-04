import * as http from 'http';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as  json from 'koa-json';
import * as Bodyparser from 'koa-bodyparser';
import AppRouter from './lib/router';
import config from './config';
// const cluster = require('cluster');
// const os = require('os');
// auth = require('koa-basic-auth');

const
    convert = require('koa-convert'),
    DEBUG = require('debug'),
    debug = DEBUG('app:debug'),
    logError = DEBUG('app:error'),
    router = new Router();

// console.log('process env:',process.env);

const app = new Koa();
const bodyparser = Bodyparser();
// middlewares
app.use(async function (ctx: Koa.Context, next: Function) {
    try {
        await next();
    } catch (err) {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.set('WWW-Authenticate', 'Basic');
            ctx.body = '未授权的访问';
        } else {
            throw err;
        }
    }
});

// app.use(auth({ name: config.auth.appkey, pass: config.auth.appsecret }));

app.use(router.allowedMethods())
    .use(convert(bodyparser))
    .use(convert(json()))
    .use(convert(logger()))
    .use(router.routes()); // 路由必须写到最后，否则post值ctx.request.body，取不到。

new AppRouter(router);

router.get('/', async function (ctx: Koa.Context) {
    return ctx.body = {
        success: 1,
        message: 'preview start',
        data: 'I am ok'
    }
});

// error logger
// app.on('error', (err: Error, ctx: Koa.Context) => {
//     logError('error occured:', err);
// })

const port = config.port || 3000;

// if (cluster.isMaster) {
//     for (let i = 0; i < os.cpus().length; i++) {
//         //克隆子进程
//         cluster.fork();
//     }
//     console.log('主进程');
// } else {
const server: http.Server = http.createServer(app.callback());
server.listen(port);
server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logError(port + ' requires elevated privileges');
            process.exit(1);
            break
        case 'EADDRINUSE':
            logError(port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', () => {
    debug('Listening on: %j', server.address());
});
// }
