import {MetaData} from "../MetaData";
import type {TransformDataType} from "../type";

export function transformDataType(dataType: any, isArray: boolean = false): string | TransformDataType {
    const name: string | undefined = dataType?.name || undefined;
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
    // Expect all data type here can be referenced by the @Property decorator
    const type = Reflect.getMetadata(MetaData.classType, dataType) ?? "interface";
    const object: Record<string, any> | undefined = Reflect.getMetadata(MetaData.classProperty, dataType);
    if (object && name) {
        const transformedDataType: TransformDataType = {
            name,
            type,
            isArray,
            body: object,
        };
        return transformedDataType;
    }
    throw new Error(`Unknown data type ${dataType}`);
}
