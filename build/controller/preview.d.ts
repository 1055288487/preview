/// <reference types="koa-router" />
import { Context } from 'koa';
export default class {
    /**
     * 生成缩略图，失败则重试,重试次数五次
     * @param ctx
     */
    static process(ctx: Context): Promise<200 | undefined>;
}
