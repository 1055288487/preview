"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const json = require("koa-json");
const Bodyparser = require("koa-bodyparser");
const router_1 = require("./lib/router");
const config_1 = require("./config");
// const cluster = require('cluster');
// const os = require('os');
// auth = require('koa-basic-auth');
const convert = require('koa-convert'), DEBUG = require('debug'), debug = DEBUG('app:debug'), logError = DEBUG('app:error'), router = new Router();
// console.log('process env:',process.env);
const app = new Koa();
const bodyparser = Bodyparser();
// middlewares
app.use(function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (err) {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.set('WWW-Authenticate', 'Basic');
                ctx.body = '未授权的访问';
            }
            else {
                throw err;
            }
        }
    });
});
// app.use(auth({ name: config.auth.appkey, pass: config.auth.appsecret }));
app.use(router.allowedMethods())
    .use(convert(bodyparser))
    .use(convert(json()))
    .use(convert(logger()))
    .use(router.routes()); // 路由必须写到最后，否则post值ctx.request.body，取不到。
new router_1.default(router);
router.get('/', function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        return ctx.body = {
            success: 1,
            message: 'preview start',
            data: 'I am ok'
        };
    });
});
// error logger
// app.on('error', (err: Error, ctx: Koa.Context) => {
//     logError('error occured:', err);
// })
const port = config_1.default.port || 3000;
// if (cluster.isMaster) {
//     for (let i = 0; i < os.cpus().length; i++) {
//         //克隆子进程
//         cluster.fork();
//     }
//     console.log('主进程');
// } else {
const server = http.createServer(app.callback());
server.listen(port);
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logError(port + ' requires elevated privileges');
            process.exit(1);
            break;
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
//# sourceMappingURL=index.js.map