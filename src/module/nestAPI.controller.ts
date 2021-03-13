import {Controller, Get, Inject} from "@nestjs/common";
import fs from "fs";
import path from "path";
import type {APIDefinition} from "../script/generate";

@Controller("_system")
export class NestAPIController {
    constructor(@Inject("NEST_API_DIRECTORY") readonly path: string) {}
    @Get("/api")
    getAPI(): APIDefinition {
        const filePath = path.join(this.path, "nest-api/api.txt");
        const rawData = fs.readFileSync(filePath, {encoding: "utf-8"});
        return JSON.parse(rawData);
    }
}
