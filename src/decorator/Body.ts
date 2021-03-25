import {Body as NestBody} from "@nestjs/common";
import {Utility} from "../util";
import type {Type, PipeTransform} from "@nestjs/common";

export function Body(): ParameterDecorator;
export function Body(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Body(bodyKey: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Body(bodyKey?: string | (Type<PipeTransform> | PipeTransform), ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator {
    return (targetClass, methodName, index) => {
        Utility.registerMethodParameter("body")(targetClass.constructor, methodName, index, typeof bodyKey === "string" ? bodyKey : null);

        // NestJS implementation
        if (!bodyKey && !pipes.length) {
            NestBody()(targetClass, methodName, index);
        } else if (typeof bodyKey === "string") {
            NestBody(bodyKey, ...pipes)(targetClass, methodName, index);
        } else {
            NestBody(...pipes)(targetClass, methodName, index);
        }
    };
}
