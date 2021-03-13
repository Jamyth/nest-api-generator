"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createControllerMethod = void 0;
const util_1 = require("../util");
const MetaData_1 = require("../MetaData");
function createControllerMethod(target, propertyKey, path, requestMethod) {
    const list = Reflect.getMetadata(MetaData_1.MetaData.controllerMethod, target.constructor) || [];
    const methodName = propertyKey;
    let _path = path ?? "/";
    _path = Array.isArray(_path) ? _path.join("/") : _path;
    const pathParams = Reflect.getMetadata(MetaData_1.MetaData.methodParameter, target.constructor) ?? [];
    const parameters = Reflect.getMetadata(MetaData_1.MetaData.paramTypes, target, propertyKey);
    let _parameters = [];
    if (parameters.length) {
        parameters.forEach((_) => {
            const type = util_1.Utility.transformDataType(_);
            if (type) {
                _parameters?.push(type);
            }
        });
    }
    else {
        _parameters = null;
    }
    let pathParamInterface = null;
    const requestType = _parameters === null ? null : _parameters.filter((_, i) => !pathParams.map((_) => _.index).includes(i))?.[0] ?? null;
    let methodPathParams = [];
    for (let i = 0; i < pathParams.length; i++) {
        const self = pathParams[i];
        const parameter = _parameters[self.index];
        const nullableKeys = typeof parameter === "string" ? [] : parameter.nullableKeys;
        const key = self.property;
        const type = (typeof parameter === "string" ? parameter : parameter.name) + (key ? (nullableKeys.includes(key) ? "| null" : "") : "");
        if (key) {
            methodPathParams.push({ name: key, type });
        }
        else {
            const body = parameter?.body;
            if (!body) {
                console.error(`[NestAPIGenerator]: Unknown path parameters -- ${methodName}`);
                continue;
            }
            pathParamInterface = parameter;
            const keys = Object.keys(body);
            const values = Object.values(body);
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
    const returnType = util_1.Utility.transformDataType(Reflect.getMetadata(MetaData_1.MetaData.controllerReturnType, target, propertyKey));
    if (!returnType) {
        throw new Error("ReturnType cannot be undefined");
    }
    const method = {
        method: requestMethod,
        name: methodName,
        path: _path,
        pathParams: methodPathParams,
        pathParamInterface,
        requestType,
        responseType: returnType,
    };
    list.push(method);
    Reflect.defineMetadata(MetaData_1.MetaData.controllerMethod, list, target.constructor);
}
exports.createControllerMethod = createControllerMethod;
