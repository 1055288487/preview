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
const rq_1 = require("./rq");
const DEBUG = require('debug'), 
// debug = DEBUG('sync:api:debug'),
logError = DEBUG('sync:api:error');
class default_1 {
    static fetchDownloadHost(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield rq_1.default.get(`/api/download/${md5}`);
            if (result.status !== 200) {
                logError('fetchDownloadHost md5:%s http status code:%d / %s', md5, result.status, result.statusText);
                return '';
            }
            return result.data.url;
        });
    }
    /**
    * 取MD5前5位生成路径 如：E96261B90BE7B1895E9193D9CB9AAC5A -> /E/9/6/2/6/
    * @param md5 32位md5
    */
    static md5toPath(md5) {
        if (md5.length < 5)
            return '';
        let p = [], path = '';
        for (let i = 0; i < 5; i++)
            p.push(md5[i]);
        path = path + p.join('/');
        return '/' + path + '/';
    }
}
exports.default = default_1;
//# sourceMappingURL=api.js.map