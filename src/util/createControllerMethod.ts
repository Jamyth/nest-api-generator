import {Utility} from "../util";
import {ControllerMethod, MethodParameter, RequestMethod, TransformDataType} from "../type";
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
