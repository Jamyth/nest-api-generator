import "reflect-metadata";
import type {MethodParameter} from "../type";
import {MetaData} from "../MetaData";

function defineEnum<TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata(MetaData.classType, "enum", target);
}

function getNullableList(target: Object): string[] {
    const list: string[] = Reflect.getMetadata(MetaData.nullableProperty, target) ?? [];
    return list;
}

function defineNullableList(list: string[], target: Object) {
    Reflect.defineMetadata(MetaData.nullableProperty, list, target);
}

function defineModule<TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata(MetaData.moduleType, "custom", target);
}

function getParamMetaData(target: Object): Record<string, MethodParameter[]> {
    const records: Record<string, MethodParameter[]> = Reflect.getMetadata(MetaData.methodParameter, target) || {};
    return records;
}

function defineParamMetaData(record: Record<string, MethodParameter[]>, target: Object) {
    Reflect.defineMetadata(MetaData.methodParameter, record, target);
}

export const ReflectUtil = Object.freeze({
    defineEnum,
    getNullableList,
    defineNullableList,
    defineModule,
    getParamMetaData,
    defineParamMetaData,
});
