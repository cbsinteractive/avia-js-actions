"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallel = void 0;
function parallel(...args) {
    return Promise.all(args);
}
exports.parallel = parallel;
