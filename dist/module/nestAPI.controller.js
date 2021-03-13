"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestAPIController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let NestAPIController = class NestAPIController {
    constructor(path) {
        this.path = path;
    }
    getAPI() {
        const filePath = path_1.default.join(this.path, "nest-api/api.txt");
        const rawData = fs_1.default.readFileSync(filePath, { encoding: "utf-8" });
        return JSON.parse(rawData);
    }
};
__decorate([
    common_1.Get("/api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], NestAPIController.prototype, "getAPI", null);
NestAPIController = __decorate([
    common_1.Controller("_system"),
    __param(0, common_1.Inject("NEST_API_DIRECTORY")),
    __metadata("design:paramtypes", [String])
], NestAPIController);
exports.NestAPIController = NestAPIController;
