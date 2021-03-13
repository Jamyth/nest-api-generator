import {MetaData} from "../MetaData";

export function Nullable(): PropertyDecorator {
    return (target, key) => {
        // For static field
        const static_list: string[] = Reflect.getMetadata(MetaData.nullableProperty, target) || [];
        static_list.push(key as string);
        Reflect.defineMetadata(MetaData.nullableProperty, static_list, target);

        // For non-static field
        const list: string[] = Reflect.getMetadata(MetaData.nullableProperty, target.constructor) || [];
        list.push(key as string);
        Reflect.defineMetadata(MetaData.nullableProperty, list, target.constructor);
    };
}
