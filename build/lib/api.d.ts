export default class {
    static fetchDownloadHost(md5: string): Promise<string>;
    /**
    * 取MD5前5位生成路径 如：E96261B90BE7B1895E9193D9CB9AAC5A -> /E/9/6/2/6/
    * @param md5 32位md5
    */
    static md5toPath(md5: string): string;
}
