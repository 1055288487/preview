"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const config_1 = require("../config");
const fs = require("fs");
const conn = mongoose.createConnection(config_1.default.mongodb.connection);
class default_1 {
    static insert(selecter) {
        return __awaiter(this, void 0, void 0, function* () {
            let gfs = Grid(conn.db, mongoose.mongo);
            let writestream = yield gfs.createWriteStream({
                filename: selecter.filename
            });
            yield fs.createReadStream(selecter.path).pipe(writestream);
        });
    }
    static find(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            let gfs = Grid(conn.db, mongoose.mongo);
            // read from mongodb
            let file = yield gfs.files.find({ filename: filename }).toArray(function (err, files) {
                if (err) {
                    throw (err);
                }
                return files;
            });
            return file;
        });
    }
    static exists(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const gfs = Grid(conn.db, mongoose.mongo);
                return gfs.exist({ filename: filename }, (err, found) => {
                    if (err)
                        reject(err);
                    resolve(found);
                });
            });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=provider.js.map