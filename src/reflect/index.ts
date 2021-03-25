import "reflect-metadata";
import type {MethodParameter, ControllerMethod} from "../type";
import {MetaData} from "../MetaData";

function getMetadata<T, TFunction extends Function = Function>(metadataKey: string, target: Object | TFunction, propertyKey?: string | symbol): T | undefined {
    return propertyKey ? Reflect.getMetadata(metadataKey, target, propertyKey) : Reflect.getMetadata(metadataKey, target);
}

/**
 * @see path src/decorator/Enum.ts
 */
function defineEnum<TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata(MetaData.classType, "enum", target);
}

function getNullableList(target: Object): string[] {
    const list: string[] = ReflectUtil.getMetadata(MetaData.nullableProperty, target) ?? [];
    return list;
}

function defineNullableList(list: string[], target: Object) {
    Reflect.defineMetadata(MetaData.nullableProperty, list, target);
}

function defineModule<TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata(MetaData.moduleType, "custom", target);
}

function getParamMetaData(target: Object): Record<string, MethodParameter[]> {
    const records: Record<string, MethodParameter[]> = ReflectUtil.getMetadata(MetaData.pathParam, target) || {};
    return records;
}

function defineParamMetaData(record: Record<string, MethodParameter[]>, target: Object) {
    Reflect.defineMetadata(MetaData.pathParam, record, target);
}

function getControllerMethods(target: Object): ControllerMethod[] {
    const methods: ControllerMethod[] = ReflectUtil.getMetadata(MetaData.controllerMethod, target) ?? [];
    return methods;
}

function defineControllerMethods(methods: ControllerMethod[], target: Object) {
    Reflect.defineMetadata(MetaData.controllerMethod, methods, target);
}

function getControllerPathParameterRecord(target: Object): Record<string, MethodParameter[]> {
    const record: Record<string, MethodParameter[]> = ReflectUtil.getMetadata(MetaData.pathParam, target) ?? {};
    return record;
}

function getFunctionParameters(target: Object, methodName: string | symbol): any[] {
    return ReflectUtil.getMetadata(MetaData.paramTypes, target, methodName) ?? [];
}

/**
 * Extract metadata from function parameter specified with @Param
 * ```typescript
 *  async getUser(@Param('id') id: string) {}
 *  async getUser(@Param() request: any) {}
 * ```
 */
function getMethodPathParams(target: Object, methodName: string | symbol): MethodParameter[] {
    const record = getControllerPathParameterRecord(target);
    return record[methodName as string] ?? [];
}

function defineMethodPathParams(parameters: MethodParameter[], target: Object, methodName: string | symbol) {
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
function getBodyOrQueryParameters(classConstructor: Object, methodName: string | symbol): MethodParameter | undefined {
    const record = ReflectUtil.getMetadata<Record<string, MethodParameter>>(MetaData.methodParameter, classConstructor) ?? {};
    return record[methodName as string];
}

function defineBodyOrQueryParameters(parameters: MethodParameter, classConstructor: Object, methodName: string | symbol) {
    const record = ReflectUtil.getMetadata<Record<string, MethodParameter>>(MetaData.methodParameter, classConstructor) ?? {};
    record[methodName as string] = parameters;
    Reflect.defineMetadata(MetaData.methodParameter, record, classConstructor);
}

/**
 * Can be any class
 */
function getMethodReturn(target: Object, methodName: string | symbol): any {
    return ReflectUtil.getMetadata(MetaData.controllerReturnType, target, methodName);
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
