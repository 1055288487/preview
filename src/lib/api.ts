import rq from './rq';
const DEBUG = require('debug'),
    // debug = DEBUG('sync:api:debug'),
    logError = DEBUG('sync:api:error');
export default class {

    public static async fetchDownloadHost(md5: string): Promise<string> {

        let result = await rq.get(`/api/download/${md5}`);
        if (result.status !== 200) {
            logError('fetchDownloadHost md5:%s http status code:%d / %s', md5, result.status, result.statusText);
            return '';
        }
        return result.data.url;
    }


    /**
    * 取MD5前5位生成路径 如：E96261B90BE7B1895E9193D9CB9AAC5A -> /E/9/6/2/6/
    * @param md5 32位md5
    */
    public static md5toPath(md5: string): string {
        if (md5.length < 5) return '';
        let p = [],
            path = '';
        for (let i = 0; i < 5; i++)
            p.push(md5[i]);

        path = path + p.join('/');
        return '/' + path + '/';
    }
}