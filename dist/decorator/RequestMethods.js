"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.All = exports.Head = exports.Patch = exports.Options = exports.Delete = exports.Put = exports.Post = exports.Get = void 0;
const common_1 = require("@nestjs/common");
const type_1 = require("../type");
const util_1 = require("../util");
function Get(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.GET);
        common_1.Get(path)(target, propertyKey, descriptor);
    };
}
exports.Get = Get;
function Post(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.POST);
        common_1.Post(path)(target, propertyKey, descriptor);
    };
}
exports.Post = Post;
function Put(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.PUT);
        common_1.Put(path)(target, propertyKey, descriptor);
    };
}
exports.Put = Put;
function Delete(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.DELETE);
        common_1.Delete(path)(target, propertyKey, descriptor);
    };
}
exports.Delete = Delete;
function Options(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.OPTIONS);
        common_1.Options(path)(target, propertyKey, descriptor);
    };
}
exports.Options = Options;
function Patch(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.PATCH);
        common_1.Patch(path)(target, propertyKey, descriptor);
    };
}
exports.Patch = Patch;
function Head(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.HEAD);
        common_1.Head(path)(target, propertyKey, descriptor);
    };
}
exports.Head = Head;
function All(path) {
    return (target, propertyKey, descriptor) => {
        util_1.Utility.createControllerMethod(target, propertyKey, path, type_1.RequestMethod.ALL);
        common_1.All(path)(target, propertyKey, descriptor);
    };
}
exports.All = All;
