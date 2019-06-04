export default class {
    static insert(selecter: any): Promise<void>;
    static find(filename: string): Promise<void>;
    static exists(filename: string): Promise<{}>;
}
