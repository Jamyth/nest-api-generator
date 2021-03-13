"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnType = void 0;
const MetaData_1 = require("../MetaData");
function ReturnType(returnType = null) {
    return (target, propertyKey) => {
        Reflect.defineMetadata(MetaData_1.MetaData.controllerReturnType, returnType, target, propertyKey);
    };
}
exports.ReturnType = ReturnType;
