import type {PipeTransform, Type} from "@nestjs/common";
import {Param as NestParam} from "@nestjs/common";
import {Utility} from "../util";

export function Param(): ParameterDecorator;
export function Param(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(property?: string | Type<PipeTransform> | PipeTransform, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        Utility.registerMethodParameter("path")(target.constructor, propertyKey, parameterIndex, typeof property === "string" ? property : null);

        if (!property && !pipes.length) {
            NestParam()(target, propertyKey, parameterIndex);
        } else if (typeof property === "string") {
            NestParam(property, ...pipes)(target, propertyKey, parameterIndex);
        } else {
            NestParam(...pipes)(target, propertyKey, parameterIndex);
        }
    };
}
