import {Module} from "@nestjs/common";
import {NestAPIController} from "./nestAPI.controller";
import type {NestAPIGeneratorOptions} from "../script/generate";

interface NestAPIModuleConfig extends NestAPIGeneratorOptions {}

@Module({})
export class NestAPIModule {
    static forRoot({appModule, globalPrefix}: NestAPIModuleConfig) {
        return {
            module: NestAPIModule,
            controllers: [NestAPIController],
            providers: [
                {provide: "APP_MODULE", useValue: appModule},
                {provide: "GLOBAL_PREFIX", useValue: globalPrefix},
            ],
        };
    }
}
