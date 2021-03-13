"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const common_1 = require("@nestjs/common");
const MetaData_1 = require("../MetaData");
function Module(moduleMetaData) {
    return (target) => {
        Reflect.defineMetadata(MetaData_1.MetaData.moduleType, "custom", target);
        common_1.Module(moduleMetaData)(target);
    };
}
exports.Module = Module;
