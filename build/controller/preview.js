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
const api_1 = require("../lib/api");
const provider_1 = require("../lib/provider");
const service_1 = require("../lib/service");
// import config from '../config';
// const debug = DEBUG('sync:service:debug'),
//     logError = DEBUG('sync:service:error');
// import * as path from 'path';
// const staticPath = '../../static',
//     fs = require('fs');
class default_1 {
    /**
     * 生成缩略图，失败则重试,重试次数五次
     * @param ctx
     */
    static process(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = ctx.request.body;
            let url = yield api_1.default.fetchDownloadHost(file.md5);
            // let url = file.downUrl
            let count = 0;
            if (!url || !url.length) {
                ctx.status = 400;
                ctx.body = `download: file ${file.md5} is not exsit.`;
                return;
            }
            let result = yield provider_1.default.exists(file.md5);
            if (!result) {
                let status = yield service_1.default.retrydeal(url, file.md5, count);
                if (status !== 200) {
                    ctx.status = 404;
                    ctx.body = `preview: preview ${file.md5} 生成失败.`;
                    return;
                }
                return ctx.status = status;
            }
            return ctx.status = 200;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=preview.js.map