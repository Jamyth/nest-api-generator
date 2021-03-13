"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestAPIModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestAPIModule = void 0;
const common_1 = require("@nestjs/common");
const nestAPI_controller_1 = require("./nestAPI.controller");
let NestAPIModule = NestAPIModule_1 = class NestAPIModule {
    static forRoot({ path }) {
        return {
            module: NestAPIModule_1,
            controllers: [nestAPI_controller_1.NestAPIController],
            providers: [{ provide: "NEST_API_DIRECTORY", useValue: path }],
        };
    }
};
NestAPIModule = NestAPIModule_1 = __decorate([
    common_1.Module({})
], NestAPIModule);
exports.NestAPIModule = NestAPIModule;
