import {ReflectUtil} from "../reflect";

export function Enumeration(): ClassDecorator {
    return (target) => {
        ReflectUtil.defineEnum(target);
    };
}
