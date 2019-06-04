import * as path from 'path';
import * as  gm from 'gm';
const imageMagick = gm.subClass({ imageMagick: true })   // imageMagick处理大的图片效率较高
const request = require('request'),
    staticPath = '../../static',
    fs = require('fs');
import config from '../config';
import db from './provider'
const DEBUG = require('debug'),
debug = DEBUG('service:debug')
export default class {

    /**
     * 处理缩略图
     * @param url 
     * @param md5 
     */
    static async dealPicture(url: string, md5: string) {
        return new Promise((resolve) => {
            imageMagick(request(url))            // 生成缩略图
                .resize(config.preview.scaling, config.preview.scaling)
                .quality(config.preview.quality)       // 设置压缩质量: 0-100
                .autoOrient()
                .write(`${path.join(__dirname, staticPath)}/${md5}`,
                    async (err: Error) => {
                        if (!err) {
                            await db.insert({
                                path: `${path.join(__dirname, staticPath)}/${md5}`,
                                filename: md5
                            })
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
        })
    }

    /**
     * 处理质量图
     * @param url 
     * @param md5 
     */
    static async dealMHPicture(url: string, md5: string) {
        return new Promise((resolve) => {
            imageMagick(request(url))               // 生成模糊图 
                .quality(config.preview.MH_quality)       // 设置压缩质量: 0-100
                .autoOrient()
                .write(`${path.join(__dirname, staticPath)}/${config.preview.prefix + md5}`,
                    async (err: Error) => {
                        if (!err) {
                            await db.insert({
                                path: `${path.join(__dirname, staticPath)}/${config.preview.prefix + md5}`,
                                filename: config.preview.prefix + md5
                            })
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
        })
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

    static async retrydeal(url: string, md5: string, count: number) {
        count = count + 1
        // let name = md5 + 'YT'
        // let newUrl = url.replace(/172.28.93.60/gm, 'ds')
        // await request(url).pipe(fs.createWriteStream(`${path.join(__dirname, staticPath)}/${name}`))
        // let Path = `${path.join(__dirname, staticPath)}/${name}`
        let thumbnail = await this.dealPicture(url, md5)
        let fuzzy = await this.dealMHPicture(url, md5)
        if (thumbnail && fuzzy) {
            // fs.unlink(`${path.join(__dirname, staticPath)}/${md5 + 'YT'}`, function (err: Error) {
            //     if (!err) console.log(`文件：${md5}临时原文件文件删除成功`)
            // });
            fs.unlink(`${path.join(__dirname, staticPath)}/${md5}`, function (err: Error) {
                if (err) debug(err)
            });
            fs.unlink(`${path.join(__dirname, staticPath)}/${config.preview.prefix + md5}`, function (err: Error) {
                if (err) debug(err)
            });
            return 200
        }
        if (count < config.retryTimes) {
            await this.retrydeal(url, md5, count)
        }
        return 404
    }

}