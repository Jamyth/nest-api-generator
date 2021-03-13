import {MetaData} from "../MetaData";
import {Utility} from "../util";

export function Property(name: string, type: any, isArray: boolean = false): PropertyDecorator {
    return (target) => {
        // For static field
        const static_object: {[key: string]: any} = Reflect.getMetadata(MetaData.classProperty, target) || {};
        static_object[name] = Utility.transformDataType(type, isArray);
        Reflect.defineMetadata(MetaData.classProperty, static_object, target);

        // For non-static field
        const object: {[key: string]: any} = Reflect.getMetadata(MetaData.classProperty, target.constructor) || {};
        object[name] = Utility.transformDataType(type, isArray);
        Reflect.defineMetadata(MetaData.classProperty, object, target.constructor);
    };
}
