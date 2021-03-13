"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestAPIGenerator = void 0;
const MetaData_1 = require("../MetaData");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
class NestAPIGenerator {
    constructor({ appModule, rootDirectory, globalPrefix = "" }) {
        this.services = [];
        this.types = [];
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
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
    getControllers() {
        console.info(chalk_1.default `{green.bold [NestAPIGenerator]} {white.bold get controllers}`);
        const imports = Reflect.getMetadata("imports", this.appModule);
        if (!imports) {
            throw new Error("No Imports found in App Module");
        }
        const modules = imports.filter((_) => Reflect.getMetadata(MetaData_1.MetaData.moduleType, _) !== undefined);
        const controllers = [];
        modules.forEach((_) => {
            const controller = Reflect.getMetadata("controllers", _)[0];
            if (controller) {
                controllers.push(controller);
            }
        });
        this.controllers = controllers;
    }
    generateService() {
        console.info(chalk_1.default `{green.bold [NestAPIGenerator]} {white.bold generating api routes}`);
        const controllers = this.controllers;
        const getServiceName = (path) => {
            return path.charAt(0).toUpperCase() + path.slice(1) + "AJAXService";
        };
        const getOperation = ({ method, name, path, requestType, responseType, pathParams }, moduleName) => {
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
            console.info(chalk_1.default `{green.bold [NestAPIGenerator]} {white.bold generating type definitions}`);
            const path = Reflect.getMetadata("path", _);
            const name = getServiceName(path);
            const methods = Reflect.getMetadata(MetaData_1.MetaData.controllerMethod, _);
            const operations = methods.map((_) => getOperation(_, path));
            this.services.push({
                name,
                operations,
            });
        });
    }
    generateTypeDefinitions() {
        const controllers = this.controllers;
        const flat = (accumulated, current) => {
            return accumulated.concat(current);
        };
        const getTransformDataType = ({ requestType, responseType, pathParamInterface }) => {
            const result = [];
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
        const toTypeDefinition = (type, prefix) => {
            const _prefix = prefix ? prefix + "$" : "";
            const definition = {
                name: _prefix + type.name,
                type: type.type,
            };
            const nullableKeys = type.nullableKeys;
            if (Object.values(type.body).some((_) => typeof _ !== "string")) {
                const keys = Object.keys(type.body);
                const keysWithPrimitiveTypes = keys.filter((_) => typeof type.body[_] === "string");
                const keysWithOtherType = keys.filter((_) => typeof type.body[_] !== "string");
                const namesOfOtherType = keysWithOtherType.map((_) => {
                    const dataType = type.body[_];
                    const isNullable = nullableKeys.includes(_);
                    let name = "";
                    if (dataType.type === "interface") {
                        name = type.name + "$" + dataType.name + (dataType.isArray ? "[]" : "");
                        return name + (isNullable ? " | null" : "");
                    }
                    name = dataType.name;
                    return name + (isNullable ? " | null" : "");
                });
                const object = keysWithPrimitiveTypes.reduce((acc, curr) => {
                    const isNullable = nullableKeys.includes(curr);
                    console.log(curr);
                    return Object.assign(acc, { [curr]: type.body[curr] + (isNullable ? "| null" : "") });
                }, {});
                keysWithOtherType.forEach((_, i) => {
                    object[_] = namesOfOtherType[i];
                });
                definition.definition = JSON.stringify(object);
                this.types.push(definition);
                keysWithOtherType.forEach((_) => {
                    const dataType = type.body[_];
                    toTypeDefinition(dataType, dataType.type === "interface" ? type.name : "");
                });
            }
            else {
                if (type.type === "enum") {
                    const keys = Object.keys(type.body);
                    const body = keys.map((curr) => `${curr} = '${curr}'`);
                    definition.definition = `{${body.join(",")}}`;
                    this.types.push(definition);
                }
                else {
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
            const methods = Reflect.getMetadata(MetaData_1.MetaData.controllerMethod, _);
            const nested_types = methods.map(getTransformDataType);
            const types = nested_types.reduce(flat, []);
            types.forEach((_) => toTypeDefinition(_));
            this.types = Array.from(new Set(this.types.map((_) => JSON.stringify(_)))).map((_) => JSON.parse(_));
        });
    }
    writeFile() {
        const content = JSON.stringify({
            services: this.services,
            types: this.types,
        })
            .replace(/"/g, "")
            .replace(/\\/g, "")
            .replace(/\//g, "");
        console.log(JSON.stringify({
            services: this.services,
            types: this.types,
        }, null, 4)
            .replace(/"/g, "")
            .replace(/\\/g, "")
            .replace(/\//g, ""));
        const _path = path_1.default.join(this.rootDirectory, "/nest-api");
        fs_1.default.mkdirSync(_path, { recursive: true });
        const filename = `${_path}/api.txt`;
        console.info(chalk_1.default `{green.bold [NestAPIGenerator]} {white.bold writing to ${filename}}`);
        fs_1.default.writeFileSync(filename, content, { encoding: "utf-8" });
    }
}
exports.NestAPIGenerator = NestAPIGenerator;
