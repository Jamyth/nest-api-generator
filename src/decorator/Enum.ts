import {MetaData} from "../MetaData";

export function Enumeration(): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(MetaData.classType, "enum", target);
    };
}
