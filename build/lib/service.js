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
const path = require("path");
const gm = require("gm");
const imageMagick = gm.subClass({ imageMagick: true }); // imageMagick处理大的图片效率较高
const request = require('request'), staticPath = '../../static', fs = require('fs');
const config_1 = require("../config");
const provider_1 = require("./provider");
const DEBUG = require('debug'), debug = DEBUG('service:debug');
class default_1 {
    /**
     * 处理缩略图
     * @param url
     * @param md5
     */
    static dealPicture(url, md5) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                imageMagick(request(url)) // 生成缩略图
                    .resize(config_1.default.preview.scaling, config_1.default.preview.scaling)
                    .quality(config_1.default.preview.quality) // 设置压缩质量: 0-100
                    .autoOrient()
                    .write(`${path.join(__dirname, staticPath)}/${md5}`, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (!err) {
                        yield provider_1.default.insert({
                            path: `${path.join(__dirname, staticPath)}/${md5}`,
                            filename: md5
                        });
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }));
            });
        });
    }
    /**
     * 处理质量图
     * @param url
     * @param md5
     */
    static dealMHPicture(url, md5) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                imageMagick(request(url)) // 生成模糊图 
                    .quality(config_1.default.preview.MH_quality) // 设置压缩质量: 0-100
                    .autoOrient()
                    .write(`${path.join(__dirname, staticPath)}/${config_1.default.preview.prefix + md5}`, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (!err) {
                        yield provider_1.default.insert({
                            path: `${path.join(__dirname, staticPath)}/${config_1.default.preview.prefix + md5}`,
                            filename: config_1.default.preview.prefix + md5
                        });
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }));
            });
        });
    }
    // static async deal(url: string, md5: string) {
    //     let thumbnail = await this.dealPicture(url, md5)
    //     let fuzzy = await this.dealMHPicture(url, md5)
    //     if (thumbnail && fuzzy) {
    //         fs.unlink(`${path.join(__dirname, staticPath)}/${md5}`, function (err: Error) {
    //             if (!err) console.log('临时缩略图文件删除成功')
    //         });
    //         fs.unlink(`${path.join(__dirname, staticPath)}/${config.preview.prefix + md5}`, function (err: Error) {
    //             if (!err) console.log('临时模糊图文件删除成功')
    //         });
    //         return 200
    //     }
    //     return 404
    // }
    static retrydeal(url, md5, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count + 1;
            // let name = md5 + 'YT'
            // let newUrl = url.replace(/172.28.93.60/gm, 'ds')
            // await request(url).pipe(fs.createWriteStream(`${path.join(__dirname, staticPath)}/${name}`))
            // let Path = `${path.join(__dirname, staticPath)}/${name}`
            let thumbnail = yield this.dealPicture(url, md5);
            let fuzzy = yield this.dealMHPicture(url, md5);
            if (thumbnail && fuzzy) {
                // fs.unlink(`${path.join(__dirname, staticPath)}/${md5 + 'YT'}`, function (err: Error) {
                //     if (!err) console.log(`文件：${md5}临时原文件文件删除成功`)
                // });
                fs.unlink(`${path.join(__dirname, staticPath)}/${md5}`, function (err) {
                    if (err)
                        debug(err);
                });
                fs.unlink(`${path.join(__dirname, staticPath)}/${config_1.default.preview.prefix + md5}`, function (err) {
                    if (err)
                        debug(err);
                });
                return 200;
            }
            if (count < config_1.default.retryTimes) {
                yield this.retrydeal(url, md5, count);
            }
            return 404;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=service.js.map