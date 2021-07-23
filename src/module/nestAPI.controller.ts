import {Controller, Get, Inject} from "@nestjs/common";
import type {APIDefinition} from "../script/generate";
import {NestAPIGenerator} from "../script/generate";

@Controller("_system")
export class NestAPIController {
    constructor(@Inject("APP_MODULE") readonly appModule: any, @Inject("GLOBAL_PREFIX") readonly globalPrefix: string | undefined) {}
    @Get("/api")
    getAPI(): APIDefinition {
        return new NestAPIGenerator({appModule: this.appModule, globalPrefix: this.globalPrefix}).run();
    }
}
