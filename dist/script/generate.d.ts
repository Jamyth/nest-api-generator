import { RequestMethod, DefinitionType } from "../type";
interface NestAPIGeneratorOptions {
    rootDirectory: string;
    appModule: any;
    globalPrefix?: string;
}
export interface APIDefinition {
    services: Service[];
    types: TypeDefinition[];
}
interface Service {
    name: string;
    operations: Operation[];
}
interface Operation {
    name: string;
    method: RequestMethod;
    path: string;
    pathParams: {
        name: string;
        type: string;
    }[];
    responseType: string;
    requestType: null | string;
}
interface TypeDefinition {
    name: string;
    type: DefinitionType;
    definition: string;
}
export declare class NestAPIGenerator {
    readonly appModule: any;
    readonly globalPrefix: string;
    readonly rootDirectory: string;
    controllers: any[];
    services: Service[];
    types: TypeDefinition[];
    constructor({ appModule, rootDirectory, globalPrefix }: NestAPIGeneratorOptions);
    run(): void;
    getControllers(): void;
    generateService(): void;
    generateTypeDefinitions(): void;
    writeFile(): void;
}
export {};
