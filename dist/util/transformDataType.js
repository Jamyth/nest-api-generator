"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataType = void 0;
const MetaData_1 = require("../MetaData");
function transformDataType(dataType, isArray = false) {
    const name = dataType?.name || undefined;
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
    const type = Reflect.getMetadata(MetaData_1.MetaData.classType, dataType) ?? "interface";
    const object = Reflect.getMetadata(MetaData_1.MetaData.classProperty, dataType);
    if (object && name) {
        const transformedDataType = {
            name,
            type,
            isArray,
            body: object,
        };
        return transformedDataType;
    }
    throw new Error(`Unknown data type ${dataType}`);
}
exports.transformDataType = transformDataType;
