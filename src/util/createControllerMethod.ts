import {Utility} from "../util";
import {ControllerMethod, MethodParameter, RequestMethod, TransformDataType} from "../type";
import {MetaData} from "../MetaData";

export function createControllerMethod(target: any, propertyKey: string | symbol, path: string | string[] | undefined, requestMethod: RequestMethod) {
    const list: ControllerMethod[] = Reflect.getMetadata(MetaData.controllerMethod, target.constructor) || [];
    const methodName = propertyKey;
    let _path = path ?? "/";
    _path = Array.isArray(_path) ? _path.join("/") : _path;

    const pathParams: MethodParameter[] = Reflect.getMetadata(MetaData.methodParameter, target.constructor) ?? [];

    const parameters: any[] = Reflect.getMetadata(MetaData.paramTypes, target, propertyKey);

    // Transform every parameters
    let _parameters: (string | TransformDataType)[] | null = [];
    if (parameters.length) {
        parameters.forEach((_) => {
            const type = Utility.transformDataType(_);
            if (type) {
                _parameters?.push(type);
            }
        });
    } else {
        _parameters = null;
    }

    const requestType = _parameters === null ? null : _parameters.filter((_, i) => !pathParams.map((_) => _.index).includes(i))?.[0] ?? null;

    let methodPathParams: {name: string; type: string}[] = [];
    // Extract Path Params
    for (let i = 0; i < pathParams.length; i++) {
        const self = pathParams[i];
        const parameter = (_parameters as (string | TransformDataType)[])[self.index];
        const type = typeof parameter === "string" ? parameter : parameter.name;
        const key = self.property;

        if (key) {
            methodPathParams.push({name: key, type});
        } else {
            // Replace
            const body = (parameter as TransformDataType)?.body;
            if (!body) {
                console.error(`[NestAPIGenerator]: Unknown path parameters -- ${methodName as string}`);
                continue;
            }
            const keys = Object.keys(body);
            const values: (string | TransformDataType)[] = Object.values(body);
            methodPathParams = keys.map((_, i) => {
                const val = values[i];
                const type = typeof val === "string" ? val : val.name;
                return {
                    name: _,
                    type,
                };
            });
            break;
        }
    }

    const returnType = Utility.transformDataType(Reflect.getMetadata(MetaData.controllerReturnType, target, propertyKey));

    if (!returnType) {
        throw new Error("ReturnType cannot be undefined");
    }

    const method: ControllerMethod = {
        method: requestMethod,
        name: methodName as string,
        path: _path,
        pathParams: methodPathParams,
        requestType,
        responseType: returnType,
    };
    list.push(method);
    Reflect.defineMetadata(MetaData.controllerMethod, list, target.constructor);
}
