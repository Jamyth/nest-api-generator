import {Module} from "@nestjs/common";
import {NestAPIController} from "./nestAPI.controller";

interface NestAPIModuleConfig {
    path: string;
}

@Module({})
export class NestAPIModule {
    public static forRoot({path}: NestAPIModuleConfig) {
        return {
            module: NestAPIModule,
            controllers: [NestAPIController],
            providers: [{provide: "NEST_API_DIRECTORY", useValue: path}],
        };
    }
}
