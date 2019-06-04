import { Context } from 'koa';
import api from '../lib/api';
import db from '../lib/provider'
import service from '../lib/service'
// import config from '../config';
// const debug = DEBUG('sync:service:debug'),
//     logError = DEBUG('sync:service:error');
// import * as path from 'path';
// const staticPath = '../../static',
//     fs = require('fs');

export default class {

    /**
     * 生成缩略图，失败则重试,重试次数五次
     * @param ctx 
     */
    static async process(ctx: Context) {
        let file = ctx.request.body
        let url = await api.fetchDownloadHost(file.md5);
        // let url = file.downUrl
        let count: number = 0;
        if (!url || !url.length) {
            ctx.status = 400;
            ctx.body = `download: file ${file.md5} is not exsit.`;
            return;
        }
        let result = await db.exists(file.md5)
        if (!result) {
            let status = await service.retrydeal(url, file.md5, count)
            if (status !== 200) {
                ctx.status = 404;
                ctx.body = `preview: preview ${file.md5} 生成失败.`;
                return;
            }
            return ctx.status = status
        }
        return ctx.status = 200;
    }



}
