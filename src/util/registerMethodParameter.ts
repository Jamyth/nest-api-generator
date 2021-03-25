import {ReflectUtil} from "../reflect";
import type {MethodParameter} from "../type";

type ParameterType = "path" | "body" | "query";

export function registerMethodParameter(type: ParameterType) {
    return (classConstructor: Object, methodName: string | symbol, index: number, property: string | null = null) => {
        const param: MethodParameter = {
            property,
            index,
        };
        if (type === "path") {
            const parameters = ReflectUtil.getMethodPathParams(classConstructor, methodName);
            parameters.push(param);
            ReflectUtil.defineMethodPathParams(parameters, classConstructor, methodName);
        } else {
            ReflectUtil.defineBodyOrQueryParameters(param, classConstructor, methodName);
        }
    };
}
