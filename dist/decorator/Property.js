"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const MetaData_1 = require("../MetaData");
const util_1 = require("../util");
function Property(name, type, isArray = false) {
    return (target) => {
        const static_object = Reflect.getMetadata(MetaData_1.MetaData.classProperty, target) || {};
        static_object[name] = util_1.Utility.transformDataType(type, isArray);
        Reflect.defineMetadata(MetaData_1.MetaData.classProperty, static_object, target);
        const object = Reflect.getMetadata(MetaData_1.MetaData.classProperty, target.constructor) || {};
        object[name] = util_1.Utility.transformDataType(type, isArray);
        Reflect.defineMetadata(MetaData_1.MetaData.classProperty, object, target.constructor);
    };
}
exports.Property = Property;
