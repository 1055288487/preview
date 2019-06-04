"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preview_1 = require("../controller/preview");
class default_1 {
    constructor(router) {
        this.router = router;
        this.register();
    }
    register() {
        this.router.post('/preview', preview_1.default.process);
    }
}
exports.default = default_1;
//# sourceMappingURL=router.js.map