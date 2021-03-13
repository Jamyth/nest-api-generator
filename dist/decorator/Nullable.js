"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nullable = void 0;
const MetaData_1 = require("../MetaData");
function Nullable() {
    return (target, key) => {
        const static_list = Reflect.getMetadata(MetaData_1.MetaData.nullableProperty, target) || [];
        static_list.push(key);
        Reflect.defineMetadata(MetaData_1.MetaData.nullableProperty, static_list, target);
        const list = Reflect.getMetadata(MetaData_1.MetaData.nullableProperty, target.constructor) || [];
        list.push(key);
        Reflect.defineMetadata(MetaData_1.MetaData.nullableProperty, list, target.constructor);
    };
}
exports.Nullable = Nullable;
