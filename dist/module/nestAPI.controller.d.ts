import type { APIDefinition } from "../script/generate";
export declare class NestAPIController {
    readonly path: string;
    constructor(path: string);
    getAPI(): APIDefinition;
}
