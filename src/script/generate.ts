import {RequestMethod, DefinitionType, ControllerMethod, TransformDataType} from "../type";
import {MetaData} from "../MetaData";
import chalk from "chalk";

export interface NestAPIGeneratorOptions {
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

    controllers: any[];

    services: Service[] = [];
    types: TypeDefinition[] = [];

    constructor({appModule, globalPrefix = ""}: NestAPIGeneratorOptions) {
        this.appModule = appModule;
        this.globalPrefix = globalPrefix;
        this.controllers = [];
    }

    run() {
        try {
            this.getControllers();
            this.generateService();
            this.generateTypeDefinitions();
            return {
                services: this.services,
                types: this.types,
            };
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

        const getType = (type: string | TransformDataType): string => {
            if (typeof type === "string") {
                return type;
            }
            if (type.isArray) {
                return type.name + "[]";
            }
            return type.name;
        };

        const getOperation = ({method, name, path, requestType, responseType, pathParams}: ControllerMethod, moduleName: string): Operation => {
            const _requestType = requestType === null ? null : getType(requestType);
            const _responseType = getType(responseType);

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

        controllers.forEach((_, i) => {
            console.info(chalk`{green.bold [NestAPIGenerator]} {white.bold generating service ${_.name} (${i + 1})}`);
            const path = Reflect.getMetadata("path", _);
            const name = getServiceName(path);
            const methods: ControllerMethod[] = Reflect.getMetadata(MetaData.controllerMethod, _) ?? [];
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
                    name = dataType.name + (dataType.isArray ? "[]" : "");
                    return name + (isNullable ? " | null" : "");
                });

                const object: any = keysWithPrimitiveTypes.reduce((acc, curr) => {
                    const isNullable = nullableKeys.includes(curr);
                    return Object.assign(acc, {
                        [curr]: type.body[curr] + (isNullable ? "| null" : ""),
                    });
                }, {});

                keysWithOtherType.forEach((_, i) => {
                    object[_] = namesOfOtherType[i];
                });

                definition.definition = JSON.stringify(object).replace(/"/g, "");
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
                    definition.definition = JSON.stringify(_definition).replace(/"/g, "");
                    this.types.push(definition);
                }
            }
        };

        controllers.forEach((_) => {
            const methods: ControllerMethod[] = Reflect.getMetadata(MetaData.controllerMethod, _) ?? []; // In case there are no methods
            const nested_types: TransformDataType[][] = methods.map(getTransformDataType);
            const types = nested_types.reduce(flat, []);
            types.forEach((_) => toTypeDefinition(_));
            this.types = Array.from(new Set(this.types.map((_) => JSON.stringify(_)))).map((_) => JSON.parse(_));
        });
    }
}
