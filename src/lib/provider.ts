import * as mongoose from 'mongoose';
import * as Grid from 'gridfs-stream';
import config from '../config'
import * as fs from 'fs';

const conn = mongoose.createConnection(config.mongodb.connection);



export default class {

    static async insert(selecter: any) {
        let gfs =  Grid(conn.db, mongoose.mongo);
        let writestream = await gfs.createWriteStream({
            filename: selecter.filename
        });
        await fs.createReadStream(selecter.path).pipe(writestream);
    }

    static async find(filename: string) {
        let gfs = Grid(conn.db, mongoose.mongo);
        // read from mongodb
        let file = await gfs.files.find({ filename: filename }).toArray(function (err, files) {
            if (err) {
                throw (err);
            }
            return files
        });
        return file
    }

    static async exists(filename: string) {
        return new Promise((resolve, reject) => {
            const gfs = Grid(conn.db, mongoose.mongo);
            return gfs.exist({ filename: filename }, (err: Error, found: any) => {
                if (err) reject(err)
                resolve(found)
            })
        })
    }


}


