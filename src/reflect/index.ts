import "reflect-metadata";
import type {MethodParameter, ControllerMethod} from "../type";
import {MetaData} from "../MetaData";

function getMetadata<T, TFunction extends Function = Function>(metadataKey: string, target: object | TFunction, propertyKey?: string | symbol): T | undefined {
    return propertyKey ? Reflect.getMetadata(metadataKey, target, propertyKey) : Reflect.getMetadata(metadataKey, target);
}

/**
 * @see path src/decorator/Enum.ts
 */
function defineEnum<TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata(MetaData.classType, "enum", target);
}

function getNullableList(target: object): string[] {
    return getMetadata(MetaData.nullableProperty, target) ?? [];
}

function defineNullableList(list: string[], target: object) {
    Reflect.defineMetadata(MetaData.nullableProperty, list, target);
}

function defineModule<TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata(MetaData.moduleType, "custom", target);
}

function getParamMetaData(target: object): Record<string, MethodParameter[]> {
    return getMetadata(MetaData.pathParam, target) || {};
}

function defineParamMetaData(record: Record<string, MethodParameter[]>, target: object) {
    Reflect.defineMetadata(MetaData.pathParam, record, target);
}

function getControllerMethods(target: object): ControllerMethod[] {
    return getMetadata(MetaData.controllerMethod, target) ?? [];
}

function defineControllerMethods(methods: ControllerMethod[], target: object) {
    Reflect.defineMetadata(MetaData.controllerMethod, methods, target);
}

function getControllerPathParameterRecord(target: object): Record<string, MethodParameter[]> {
    return getMetadata(MetaData.pathParam, target) ?? {};
}

function getFunctionParameters(target: object, methodName: string | symbol): any[] {
    return getMetadata(MetaData.paramTypes, target, methodName) ?? [];
}

/**
 * Extract metadata from function parameter specified with @Param
 * ```typescript
 *  async getUser(@Param('id') id: string) {}
 *  async getUser(@Param() request: any) {}
 * ```
 */
function getMethodPathParams(target: object, methodName: string | symbol): MethodParameter[] {
    const record = getControllerPathParameterRecord(target);
    return record[methodName as string] ?? [];
}

function defineMethodPathParams(parameters: MethodParameter[], target: object, methodName: string | symbol) {
    const record = getControllerPathParameterRecord(target);
    record[methodName as string] = parameters;
    Reflect.defineMetadata(MetaData.pathParam, record, target);
}

/**
 * Extract metadata from function parameter specified with @Body | @Query
 * ```typescript
 *  async getUser(@Body() request: any) {}
 *  async getUser(@Query() request: any) {}
 * ```
 */
function getBodyOrQueryParameters(classConstructor: object, methodName: string | symbol): MethodParameter | undefined {
    const record = getMetadata<Record<string, MethodParameter>>(MetaData.methodParameter, classConstructor) ?? {};
    return record[methodName as string];
}

function defineBodyOrQueryParameters(parameters: MethodParameter, classConstructor: object, methodName: string | symbol) {
    const record = getMetadata<Record<string, MethodParameter>>(MetaData.methodParameter, classConstructor) ?? {};
    record[methodName as string] = parameters;
    Reflect.defineMetadata(MetaData.methodParameter, record, classConstructor);
}

/**
 * Can be any class
 */
function getMethodReturn(target: object, methodName: string | symbol): any {
    const returnType = getMetadata(MetaData.controllerReturnType, target, methodName);
    if (returnType === undefined) {
        throw new Error(`Return Type for method -- ${String(methodName)} is not found`);
    }
    return returnType;
}

export const ReflectUtil = Object.freeze({
    getMetadata,
    defineEnum,
    getNullableList,
    defineNullableList,
    defineModule,
    getParamMetaData,
    defineParamMetaData,
    getControllerMethods,
    defineControllerMethods,
    getControllerPathParameterRecord,
    getMethodPathParams,
    getFunctionParameters,
    getBodyOrQueryParameters,
    defineMethodPathParams,
    defineBodyOrQueryParameters,
    getMethodReturn,
});
