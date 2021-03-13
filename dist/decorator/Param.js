"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = void 0;
const common_1 = require("@nestjs/common");
const MetaData_1 = require("../MetaData");
function Param(property, ...pipes) {
    return (target, propertyKey, parameterIndex) => {
        var _a;
        const records = Reflect.getMetadata(MetaData_1.MetaData.methodParameter, target.constructor) || {};
        const list = (_a = records[propertyKey]) !== null && _a !== void 0 ? _a : [];
        const param = {
            property: typeof property === "string" ? property : null,
            index: parameterIndex,
        };
        list.push(param);
        records[propertyKey] = list;
        Reflect.defineMetadata(MetaData_1.MetaData.methodParameter, records, target.constructor);
        if (!property && !pipes.length) {
            common_1.Param()(target, propertyKey, parameterIndex);
        }
        else if (typeof property === "string") {
            common_1.Param(property, ...pipes)(target, propertyKey, parameterIndex);
        }
        else {
            common_1.Param(...pipes)(target, propertyKey, parameterIndex);
        }
    };
}
exports.Param = Param;
