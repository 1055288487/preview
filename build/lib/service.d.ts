export default class {
    /**
     * 处理缩略图
     * @param url
     * @param md5
     */
    static dealPicture(url: string, md5: string): Promise<{}>;
    /**
     * 处理质量图
     * @param url
     * @param md5
     */
    static dealMHPicture(url: string, md5: string): Promise<{}>;
    static retrydeal(url: string, md5: string, count: number): Promise<200 | 404>;
}
