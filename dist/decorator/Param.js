"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = void 0;
const common_1 = require("@nestjs/common");
const MetaData_1 = require("../MetaData");
function Param(property, ...pipes) {
    return (target, propertyKey, parameterIndex) => {
        const list = Reflect.getMetadata(MetaData_1.MetaData.methodParameter, target.constructor) || [];
        const param = {
            property: typeof property === "string" ? property : null,
            index: parameterIndex,
        };
        list.push(param);
        Reflect.defineMetadata(MetaData_1.MetaData.methodParameter, list, target.constructor);
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
