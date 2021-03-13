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
    const _parameters = parameters.length ? parameters.map((_) => util_1.Utility.transformDataType(_)) : null;
    const requestType = _parameters === null ? null : _parameters.filter((_, i) => !pathParams.map((_) => _.index).includes(i))?.[0] ?? null;
    let methodPathParams = [];
    for (let i = 0; i < pathParams.length; i++) {
        const self = pathParams[i];
        const parameter = _parameters[self.index];
        const type = typeof parameter === "string" ? parameter : parameter.name;
        const key = self.property;
        if (key) {
            methodPathParams.push({ name: key, type });
        }
        else {
            const body = parameter?.body;
            if (!body) {
                console.error(`[NestAPIGenerator]: Unknown path parameters -- ${methodName}`);
                continue;
            }
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
    const method = {
        method: requestMethod,
        name: methodName,
        path: _path,
        pathParams: methodPathParams,
        requestType,
        responseType: returnType,
    };
    list.push(method);
    Reflect.defineMetadata(MetaData_1.MetaData.controllerMethod, list, target.constructor);
}
exports.createControllerMethod = createControllerMethod;
