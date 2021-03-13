import { PipeTransform, Type } from "@nestjs/common";
export declare function Param(): ParameterDecorator;
export declare function Param(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export declare function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
