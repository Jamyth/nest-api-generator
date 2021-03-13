import {RequestMethod, DefinitionType, ControllerMethod, TransformDataType} from "../type";
import {MetaData} from "../MetaData";
import fs from "fs";
import path from "path";
import chalk from "chalk";

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
    pathParams: {name: string; type: string}[];
    responseType: string;
    requestType: null | string;
}

interface TypeDefinition {
    name: string;
    type: DefinitionType;
    definition: string;
}

export class NestAPIGenerator {
    // class AppModule
    readonly appModule: any;
    readonly globalPrefix: string;
    readonly rootDirectory: string;

    controllers: any[];

    services: Service[] = [];
    types: TypeDefinition[] = [];

    constructor({appModule, rootDirectory, globalPrefix = ""}: NestAPIGeneratorOptions) {
        this.appModule = appModule;
        this.globalPrefix = globalPrefix;
        this.rootDirectory = rootDirectory;
        this.controllers = [];
    }

    run() {
        try {
            this.getControllers();
            this.generateService();
            this.generateTypeDefinitions();
            this.writeFile();
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }

    getControllers() {
        console.info(chalk`{green.bold [NestAPIGenerator]} {white.bold get controllers}`);
        const imports: any[] = Reflect.getMetadata("imports", this.appModule);
        if (!imports) {
            throw new Error("No Imports found in App Module");
        }
        const modules: any[] = imports.filter((_) => Reflect.getMetadata(MetaData.moduleType, _) !== undefined);
        const controllers: any[] = [];
        modules.forEach((_) => {
            const controller = Reflect.getMetadata("controllers", _)[0];
            if (controller) {
                controllers.push(controller);
            }
        });
        this.controllers = controllers;
    }

    generateService() {
        console.info(chalk`{green.bold [NestAPIGenerator]} {white.bold generating api routes}`);
        const controllers = this.controllers;

        const getServiceName = (path: string) => {
            return path.charAt(0).toUpperCase() + path.slice(1) + "AJAXService";
        };

        const getOperation = ({method, name, path, requestType, responseType, pathParams}: ControllerMethod, moduleName: string): Operation => {
            const _requestType = requestType === null ? null : typeof requestType === "string" ? requestType : requestType.isArray ? requestType.name + "[]" : requestType.name;

            const _responseType = typeof responseType === "string" ? responseType : responseType.isArray ? responseType.name + "[]" : responseType.name;

            const _path = (this.globalPrefix.endsWith("/") ? this.globalPrefix : this.globalPrefix + "/") + moduleName + path;
            return {
                method,
                name,
                path: _path,
                pathParams,
                requestType: _requestType,
                responseType: _responseType,
            };
        };

        controllers.forEach((_) => {
            console.info(chalk`{green.bold [NestAPIGenerator]} {white.bold generating type definitions}`);
            const path = Reflect.getMetadata("path", _);
            const name = getServiceName(path);
            const methods: ControllerMethod[] = Reflect.getMetadata(MetaData.controllerMethod, _);
            const operations: Operation[] = methods.map((_) => getOperation(_, path));
            this.services.push({
                name,
                operations,
            });
        });
    }

    generateTypeDefinitions() {
        const controllers = this.controllers;

        const flat = (accumulated: TransformDataType[], current: TransformDataType[]) => {
            return accumulated.concat(current);
        };

        const getTransformDataType = ({requestType, responseType, pathParamInterface}: ControllerMethod): TransformDataType[] => {
            const result: TransformDataType[] = [];
            if (pathParamInterface) {
                result.push(pathParamInterface);
            }
            if (requestType && typeof requestType !== "string") {
                result.push(requestType);
            }

            if (responseType && typeof responseType !== "string") {
                result.push(responseType);
            }
            return result;
        };

        const toTypeDefinition = (type: TransformDataType, prefix?: string) => {
            const _prefix = prefix ? prefix + "$" : "";
            const definition: TypeDefinition = {
                name: _prefix + type.name,
                type: type.type,
            } as TypeDefinition;
            const nullableKeys = type.nullableKeys;
            if (Object.values(type.body).some((_) => typeof _ !== "string")) {
                const keys = Object.keys(type.body);
                const keysWithPrimitiveTypes = keys.filter((_) => typeof type.body[_] === "string");
                const keysWithOtherType = keys.filter((_) => typeof type.body[_] !== "string");
                const namesOfOtherType = keysWithOtherType.map((_) => {
                    const dataType: TransformDataType = type.body[_];
                    const isNullable = nullableKeys.includes(_);
                    let name: string = "";
                    if (dataType.type === "interface") {
                        name = type.name + "$" + dataType.name + (dataType.isArray ? "[]" : "");
                        return name + (isNullable ? " | null" : "");
                    }
                    name = dataType.name;
                    return name + (isNullable ? " | null" : "");
                });

                const object: any = keysWithPrimitiveTypes.reduce((acc, curr) => {
                    const isNullable = nullableKeys.includes(curr);
                    console.log(curr);
                    return Object.assign(acc, {[curr]: type.body[curr] + (isNullable ? "| null" : "")});
                }, {});
                keysWithOtherType.forEach((_, i) => {
                    object[_] = namesOfOtherType[i];
                });

                definition.definition = JSON.stringify(object);
                this.types.push(definition);

                keysWithOtherType.forEach((_) => {
                    const dataType: TransformDataType = type.body[_];
                    toTypeDefinition(dataType, dataType.type === "interface" ? type.name : "");
                });
            } else {
                if (type.type === "enum") {
                    const keys = Object.keys(type.body);
                    const body = keys.map((curr) => `${curr} = '${curr}'`);
                    definition.definition = `{${body.join(",")}}`;
                    this.types.push(definition);
                } else {
                    const entries = Object.entries(type.body);
                    const _definition = entries.reduce((acc, [key, value]) => {
                        const isNullable = nullableKeys.includes(key);
                        return Object.assign(acc, {
                            [key]: value + (isNullable ? "| null" : ""),
                        });
                    }, {});
                    definition.definition = JSON.stringify(_definition);
                    this.types.push(definition);
                }
            }
        };

        controllers.forEach((_) => {
            const methods: ControllerMethod[] = Reflect.getMetadata(MetaData.controllerMethod, _);
            const nested_types: TransformDataType[][] = methods.map(getTransformDataType);
            const types = nested_types.reduce(flat, []);
            types.forEach((_) => toTypeDefinition(_));
            this.types = Array.from(new Set(this.types.map((_) => JSON.stringify(_)))).map((_) => JSON.parse(_));
        });
    }

    writeFile() {
        const content = JSON.stringify({
            services: this.services,
            types: this.types,
        });
        // .replace(/"/g, "")
        // .replace(/\\/g, "")
        // .replace(/\//g, "");
        console.log(
            JSON.stringify(
                {
                    services: this.services,
                    types: this.types,
                },
                null,
                4
            )
                .replace(/"/g, "")
                .replace(/\\/g, "")
                .replace(/\//g, "")
        );
        const _path = path.join(this.rootDirectory, "/nest-api");
        fs.mkdirSync(_path, {recursive: true});
        const filename = `${_path}/api.txt`;
        console.info(chalk`{green.bold [NestAPIGenerator]} {white.bold writing to ${filename}}`);
        fs.writeFileSync(filename, content, {encoding: "utf-8"});
    }
}
