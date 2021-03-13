import {MetaData} from "../MetaData";

export function ReturnType(returnType: any = null): MethodDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(MetaData.controllerReturnType, returnType, target, propertyKey);
    };
}
