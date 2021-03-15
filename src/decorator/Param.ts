import {Param as NestParam, PipeTransform, Type} from "@nestjs/common";
import {MethodParameter} from "../type";
import {ReflectUtil} from "../reflect";

export function Param(): ParameterDecorator;
export function Param(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(property?: string | Type<PipeTransform> | PipeTransform, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const records = ReflectUtil.getParamMetaData(target.constructor);
        const list = records[propertyKey as string] ?? [];
        const param: MethodParameter = {
            property: typeof property === "string" ? property : null,
            index: parameterIndex,
        };

        list.push(param);
        records[propertyKey as string] = list;

        ReflectUtil.defineParamMetaData(records, target.constructor);

        if (!property && !pipes.length) {
            NestParam()(target, propertyKey, parameterIndex);
        } else if (typeof property === "string") {
            NestParam(property, ...pipes)(target, propertyKey, parameterIndex);
        } else {
            NestParam(...pipes)(target, propertyKey, parameterIndex);
        }
    };
}
