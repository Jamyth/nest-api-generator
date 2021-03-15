import {ReflectUtil} from "../reflect";

export function Nullable(): PropertyDecorator {
    return (target, key) => {
        // For static field
        const static_list: string[] = ReflectUtil.getNullableList(target);
        static_list.push(key as string);
        ReflectUtil.defineNullableList(static_list, target);

        // For non-static field
        const list: string[] = ReflectUtil.getNullableList(target.constructor);
        list.push(key as string);
        ReflectUtil.defineNullableList(list, target.constructor);
    };
}
