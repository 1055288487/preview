import * as axios from 'axios';
export default class {
    static get(path: string): Promise<axios.AxiosResponse>;
    static put(path: string, data: any): Promise<axios.AxiosResponse>;
    static post(path: string, data: any): Promise<axios.AxiosResponse>;
    static delete(path: string): Promise<axios.AxiosResponse>;
    static pipe(opt: axios.AxiosRequestConfig, savePath: string, onFinish: () => void, onError?: Function): Promise<void>;
}
