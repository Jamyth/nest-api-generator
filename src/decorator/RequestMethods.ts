import {Get as NestGet, Post as NestPost, Put as NestPut, Delete as NestDelete, Patch as NestPatch, Options as NestOptions, Head as NestHead, All as NestAll} from "@nestjs/common";
import {RequestMethod} from "../type";
import {Utility} from "../util";

function pathTransformer(path?: string | string[]): string {
    return path ? (Array.isArray(path) ? path.join("/") : path) : "/";
}

export function Get(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.GET);
        NestGet(path)(target, propertyKey, descriptor);
    };
}
export function Post(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.POST);
        NestPost(path)(target, propertyKey, descriptor);
    };
}
export function Put(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.PUT);
        NestPut(path)(target, propertyKey, descriptor);
    };
}
export function Delete(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.DELETE);
        NestDelete(path)(target, propertyKey, descriptor);
    };
}
export function Options(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.OPTIONS);
        NestOptions(path)(target, propertyKey, descriptor);
    };
}
export function Patch(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.PATCH);
        NestPatch(path)(target, propertyKey, descriptor);
    };
}
export function Head(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.HEAD);
        NestHead(path)(target, propertyKey, descriptor);
    };
}
export function All(path?: string | string[] | undefined): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Utility.createService(target, propertyKey, pathTransformer(path), RequestMethod.ALL);
        NestAll(path)(target, propertyKey, descriptor);
    };
}
