import {Utility} from "../util";
import {ControllerMethod, MethodParameter, RequestMethod, TransformDataType} from "../type";
import {MetaData} from "../MetaData";
import {ReflectUtil} from "../reflect";

export function createService(target: Object, methodName: string | symbol, path: string, requestMethod: RequestMethod) {
    /**
     * Get functions defined with @Get @Post @Delete @Put etc...
     */
    const controllerMethods = ReflectUtil.getControllerMethods(target.constructor);

    /**
     * function paramter defined with @Param decorator
     */
    const pathParameters = ReflectUtil.getMethodPathParams(target.constructor, methodName);

    /**
     * function parameter defined with @Body or @Query decorator
     * @expected There is only one element in this variable
     * Body and Query should not appear in the same time
     */
    const bodyOrQueryParameters = ReflectUtil.getBodyOrQueryParameters(target.constructor, methodName);

    /**
     * actual function parameters, may have types of number / string / other
     */
    const rawParameters = ReflectUtil.getFunctionParameters(target, methodName);

    const transformedParameters = rawParameters.map((_) => Utility.transformDataType(_));
    /**
     * the actual parameter of type @Body | @Query
     */
    const requestType = transformedParameters.find((_, i) => bodyOrQueryParameters?.index === i) ?? null;
    const {pathParams, pathParamInterface} = getPathParams(pathParameters, transformedParameters);
    const responseType = Utility.transformDataType(ReflectUtil.getMethodReturn(target, methodName)) ?? "void";

    const service: ControllerMethod = {
        method: requestMethod,
        name: methodName as string,
        path,
        pathParams,
        pathParamInterface,
        requestType,
        responseType,
    };

    controllerMethods.push(service);
    ReflectUtil.defineControllerMethods(controllerMethods, target.constructor);
}

function getPathParams(pathParameters: MethodParameter[], transformedParameters: (string | TransformDataType | undefined)[]) {
    let pathParamInterface: string | TransformDataType | null = null;
    let pathParams: {name: string; type: string}[] = [];

    for (let i = 0; i < pathParameters.length; i++) {
        const param = pathParameters[i];
        const parameter = transformedParameters[param.index]!;
        const nullableKeys = typeof parameter === "string" ? [] : parameter.nullableKeys;
        const propertyKey = param.property;
        const isNullable = propertyKey ? nullableKeys.includes(propertyKey) : false;
        const type = (typeof parameter === "string" ? parameter : parameter.name) + (isNullable ? "| null" : "");
        if (propertyKey) {
            pathParams.push({name: propertyKey, type});
        } else {
            const body = (parameter as TransformDataType).body;
            pathParamInterface = parameter;
            pathParams = Object.entries(body).map(([name, param]: [string, string | TransformDataType]) => ({
                name,
                type: typeof param === "string" ? param : param.name,
            }));
            break;
        }
    }

    return {
        pathParams,
        pathParamInterface,
    };
}

export function createControllerMethod(target: any, propertyKey: string | symbol, path: string | string[] | undefined, requestMethod: RequestMethod) {
    const list: ControllerMethod[] = Reflect.getMetadata(MetaData.controllerMethod, target.constructor) || [];
    const methodName = propertyKey;
    let _path = path ?? "/";
    _path = Array.isArray(_path) ? _path.join("/") : _path;

    const pathEntries: Record<string, MethodParameter[]> = Reflect.getMetadata(MetaData.pathParam, target.constructor) ?? {};
    const pathParams = pathEntries[methodName as string] ?? [];
    // Get All Parameters
    // TODO: Make the function only support Param, Query, Body only
    const parameters: any[] = Reflect.getMetadata(MetaData.paramTypes, target, propertyKey);

    // Transform every parameters
    let _parameters: (string | TransformDataType | undefined)[] | null = [];
    if (parameters.length) {
        parameters.forEach((_) => {
            const type = Utility.transformDataType(_);
            _parameters?.push(type);
        });
    } else {
        _parameters = null;
    }

    let pathParamInterface: any | null = null;

    const requestType = _parameters === null ? null : _parameters.filter((_, i) => !pathParams.map((_) => _.index).includes(i))?.[0] ?? null;

    let methodPathParams: {name: string; type: string}[] = [];
    // Extract Path Params
    for (let i = 0; i < pathParams.length; i++) {
        const self = pathParams[i];
        const parameter: string | TransformDataType | undefined = (_parameters as (string | TransformDataType)[])[self.index];
        const nullableKeys = typeof parameter === "string" ? [] : parameter?.nullableKeys ?? [];
        const key = self.property;
        const type = (typeof parameter === "string" ? parameter : parameter?.name) + (key ? (nullableKeys.includes(key) ? "| null" : "") : "");

        if (key) {
            methodPathParams.push({name: key, type});
        } else {
            // Replace
            const body = (parameter as TransformDataType)?.body;
            if (!body) {
                console.error(`[NestAPIGenerator]: Unknown path parameters -- ${methodName as string}`);
                continue;
            }
            pathParamInterface = parameter;
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
        pathParamInterface,
        requestType,
        responseType: returnType,
    };
    list.push(method);
    Reflect.defineMetadata(MetaData.controllerMethod, list, target.constructor);
}
