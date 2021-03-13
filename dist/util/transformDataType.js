"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataType = void 0;
const MetaData_1 = require("../MetaData");
function transformDataType(dataType, isArray = false) {
    var _a, _b;
    const name = (dataType === null || dataType === void 0 ? void 0 : dataType.name) || undefined;
    if (dataType === null) {
        return "void";
    }
    switch (name) {
        case "String":
        case "Number":
        case "Boolean":
        case "Date":
            return isArray ? name.toLowerCase() + "[]" : name.toLowerCase();
    }
    const nullableKeys = (_a = Reflect.getMetadata(MetaData_1.MetaData.nullableProperty, dataType)) !== null && _a !== void 0 ? _a : [];
    const type = (_b = Reflect.getMetadata(MetaData_1.MetaData.classType, dataType)) !== null && _b !== void 0 ? _b : "interface";
    const object = Reflect.getMetadata(MetaData_1.MetaData.classProperty, dataType);
    if (object && name) {
        const transformedDataType = {
            name,
            type,
            isArray,
            nullableKeys,
            body: object,
        };
        return transformedDataType;
    }
}
exports.transformDataType = transformDataType;
