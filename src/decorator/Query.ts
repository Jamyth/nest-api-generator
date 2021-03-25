import {Query as NestQuery} from "@nestjs/common";
import {Utility} from "../util";
import type {Type, PipeTransform} from "@nestjs/common";

export function Query(): ParameterDecorator;
export function Query(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Query(queryKey: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Query(queryKey?: string | (Type<PipeTransform> | PipeTransform), ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator {
    return (targetClass, methodName, index) => {
        Utility.registerMethodParameter("query")(targetClass.constructor, methodName, index, typeof queryKey === "string" ? queryKey : null);

        // NestJS implementation
        if (!queryKey && !pipes.length) {
            NestQuery()(targetClass, methodName, index);
        } else if (typeof queryKey === "string") {
            NestQuery(queryKey, ...pipes)(targetClass, methodName, index);
        } else {
            NestQuery(...pipes)(targetClass, methodName, index);
        }
    };
}
