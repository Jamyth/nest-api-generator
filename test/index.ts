import {Module, Nullable, Property, Query, Get, Body, ReturnType, Param, NestAPIGenerator, Enumeration} from "../src";
import {Controller} from "@nestjs/common";
import "reflect-metadata";
import path from "path";

@Enumeration()
class EnumTest {
    @Property("a", String)
    static a = "a";

    @Property("b", String)
    static b = "b";
}

class Customer {
    @Property("name", String)
    name: string;

    @Nullable()
    @Property("age", Number)
    age: number | null;

    @Property("key", EnumTest, true)
    key: EnumTest[];
}
class Request {
    @Property("pageIndex", Number)
    pageIndex: number;

    @Property("customer", Customer)
    customer: Customer;
}
class IRequest {
    pageIndex: number;
}

class Response {
    @Property("data", Customer)
    data: Customer;
}

@Controller("controller")
export class MyController {
    @Get("/")
    @ReturnType(Response)
    testNullable(@Query() query: Request, @Param("path") request: string) {
        return;
    }
    @Get("/something")
    @ReturnType()
    test(@Body() request: Request) {
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

const definition = new NestAPIGenerator({
    appModule: AppModule,
}).run();
console.info(definition);
