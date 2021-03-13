import {Module as NestModule, ModuleMetadata} from "@nestjs/common";
import {MetaData} from "../MetaData";

export function Module(moduleMetaData: ModuleMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(MetaData.moduleType, "custom", target);
        NestModule(moduleMetaData)(target);
    };
}
