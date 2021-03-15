import {Module, Nullable, Property, MetaData, Get, ReturnType, Param, NestAPIGenerator} from "../src";
import {Controller} from "@nestjs/common";
import "reflect-metadata";
import path from "path";

class Request {
    @Property("pageIndex", Number)
    pageIndex: number;
}

class Customer {
    @Property("name", String)
    name: string;

    @Nullable()
    @Property("age", Number)
    age: number | null;
}

class Response {
    @Property("data", Customer)
    data: Customer;
}

@Controller("controller")
export class MyController {
    @Get("/")
    @ReturnType(Response)
    testNullable(gogo: number, @Param() request: Request) {
        return;
    }

    @Get("/")
    @ReturnType(Response)
    test(request: number) {
        return;
    }
}

@Module({
    controllers: [MyController],
})
class MyModule {}

@Module({
    imports: [MyModule],
})
class AppModule {}

new NestAPIGenerator({
    rootDirectory: path.join(__dirname, ""),
    appModule: AppModule,
}).run();
