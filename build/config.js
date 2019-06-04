"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'enable': true,
    'port': '8080',
    'retryTimes': 2,
    'mongodb': {
        // 'connection': 'mongodb://192.168.16.181:27017/picture'
        'connection': 'mongodb://172.28.93.60:27017/picture'
    },
    // 'rabbitmq': {
    //     'connection': 'amqp://guest:guest@192.168.16.181:5672?heartbeat=40',
    //     // 'mqs': ['picture_all']
    //     'mqs': ['picture_all', 'file_0', 'file_1', 'file_2', 'file_3', 'file_4', 'file_5', 'file_6', 'file_7', 'file_8', 'file_9', 'file_a', 'file_b', 'file_c', 'file_d', 'file_e', 'file_f']
    // },
    'storage': {
        'prefix': ''
    },
    'api': {
        // 'host': 'http://192.168.16.181',
        'host': 'http://172.28.93.60:80',
        'appkey': '4f860649600a47508379639dba82327d',
        'appsecret': 'f3b58f6b935b4acd9d9e795864ad10d4'
    },
    'preview': {
        'scaling': 70,
        'quality': 80,
        'MH_quality': 10,
        'prefix': 'MH'
    },
};
//# sourceMappingURL=config.js.map