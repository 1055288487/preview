import * as Router from 'koa-router'
import preview from '../controller/preview';
export default class {
    router: Router;
    constructor(router: Router) {
        this.router = router;
        this.register();
    }

    register() {
        this.router.post('/preview', preview.process)
    }
}
