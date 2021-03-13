"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enumeration = void 0;
const MetaData_1 = require("../MetaData");
function Enumeration() {
    return (target) => {
        Reflect.defineMetadata(MetaData_1.MetaData.classType, "enum", target);
    };
}
exports.Enumeration = Enumeration;
