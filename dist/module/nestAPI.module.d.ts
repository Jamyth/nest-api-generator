import { NestAPIController } from "./nestAPI.controller";
interface NestAPIModuleConfig {
    path: string;
}
export declare class NestAPIModule {
    static forRoot({ path }: NestAPIModuleConfig): {
        module: typeof NestAPIModule;
        controllers: (typeof NestAPIController)[];
        providers: {
            provide: string;
            useValue: string;
        }[];
    };
}
export {};
