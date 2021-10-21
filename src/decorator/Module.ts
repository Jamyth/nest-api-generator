import type {ModuleMetadata} from "@nestjs/common";
import {Module as NestModule} from "@nestjs/common";
import {ReflectUtil} from "../reflect";

export function Module(moduleMetaData: ModuleMetadata): ClassDecorator {
    return (target) => {
        ReflectUtil.defineModule(target);
        NestModule(moduleMetaData)(target);
    };
}
