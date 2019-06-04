declare global {

    interface IQueue {
        name: string;
        pattern: string;
    }

    interface IFile {

        md5: string;
        fileName: string;
        user: { sender: string, receiver: string };
        client: { name: string, version: number };
        length: number;
        path: string;
        createDate: number;
        hitTimes: number;
        lastHitDate: number;
        donwloadHost: string;
        errorTimes:number;
    }

}

export { };