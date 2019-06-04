import * as axios from 'axios';
import * as fs from 'fs';
import config from '../config';
const DEBUG = require('debug'),
    debug = DEBUG('api:debug'),
    logError = DEBUG('api:error'),
    options: axios.AxiosRequestConfig = {
        baseURL: config.api.host,
        auth: {
            username: config.api.appkey,
            password: config.api.appsecret
        },
        headers: {
            'Content-Type': 'application/json'
        }

    };


export default class {

    static async  get(path: string): Promise<axios.AxiosResponse> {
        debug('rq get:%s%s', options.baseURL, path);
        return await axios.default.get(path, options);
    }

    static async put(path: string, data: any): Promise<axios.AxiosResponse> {
        debug('rq put:%s%s,data:%j', options.baseURL, path, data);
        return await axios.default.put(path, data, options);
    }

    static async post(path: string, data: any): Promise<axios.AxiosResponse> {
        debug('rq post:%s%s,data:%j', options.baseURL, path, data);
        return await axios.default.post(path, data, options);
    }

    static async delete(path: string): Promise<axios.AxiosResponse> {
        debug('rq post:%s%s', options.baseURL, path);
        return await axios.default.delete(path, options);
    }

    static async pipe(opt: axios.AxiosRequestConfig, savePath: string, onFinish: () => void, onError?: Function) {
        let response = await axios.default(opt);
        let writeStream = fs.createWriteStream(savePath);

        writeStream.on('error', (err: Error) => {
            writeStream.close();
            logError('write file error:', err);
            if (onError)
                onError(err);
        });

        if (onFinish)
            writeStream.on('finish', onFinish);

        if (response.status !== 200) {
            logError('http request error:%j - %d - %s', opt, response.status, response.statusText);
            if (onError)
                onError(new Error(response.statusText));
        } else {
            response.data.pipe(writeStream);
        }
    }
}