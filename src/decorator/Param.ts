import {Param as NestParam, PipeTransform, Type} from "@nestjs/common";
import {MetaData} from "../MetaData";
import {MethodParameter} from "../type";

export function Param(): ParameterDecorator;
export function Param(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(property?: string | Type<PipeTransform> | PipeTransform, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const records: Record<string, MethodParameter[]> = Reflect.getMetadata(MetaData.methodParameter, target.constructor) || {};
        const list = records[propertyKey as string] ?? [];
        const param: MethodParameter = {
            property: typeof property === "string" ? property : null,
            index: parameterIndex,
        };

        list.push(param);
        records[propertyKey as string] = list;

        Reflect.defineMetadata(MetaData.methodParameter, records, target.constructor);

        if (!property && !pipes.length) {
            NestParam()(target, propertyKey, parameterIndex);
        } else if (typeof property === "string") {
            NestParam(property, ...pipes)(target, propertyKey, parameterIndex);
        } else {
            NestParam(...pipes)(target, propertyKey, parameterIndex);
        }
    };
}
