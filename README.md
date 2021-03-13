# **Nest API Generator** &middot; [![Github license](https://img.shields.io/badge/license-MIT-blue.svg)]() [![npm version](https://img.shields.io/npm/v/nest-api-generator)](https://npmjs.com/package/nest-api-generator)

//![Downloads](https://img.shields.io/npm/dw/nest-api-generator.svg?color=blue)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p>
    <h3 align="center">THIS IS NOT AN OFFICIAL PACKAGE</h3>
</p>

A Nest JS API Generation tool, aiming to provide the complete API information for front-end developer.

## **Feature**

-   Similar usage between NestJS
-   Build api docs on build time
-   With an endpoint for fetching the api docs

<hr>

## **Content**

-   What you can achieve from this package
-   Installation
-   Usage
-   Decorators
    -   Extended from NestJS
    -   New Decorators
        -   Property
        -   Enumeration
        -   ReturnType
-   Nest API Generation Script
-   API fetching Endpoint Setup

## **What you can achieve from this package**

> As a front-end developer, sometimes it is a nightmare to create the `code` of the API by just looking at the api documentation.

> I am sure most of the front-end developer would like to have an `one-click` code generation, doing the things that fetches the API endpoint associate with its interface or enum, things like that.

> But it would also be a nightmare to backend-developer that they might have to build an endpoint with the complete API and the interfaces.

> You can satisfy both front-end and back-end with `this` package.

<hr>

## **Installation**

### Install with NPM / YARN

```zsh
$ npm install nest-api-generator
// or
$ yarn add nest-api-generator
```

## **Usage**

For simplicity, `NestJS` provides a CLI code generation for things like `module`, `controller`.

**There are two files you are going to modify**

-   xxx.module.ts
-   xxx.controller.ts

### **module.ts**

```ts
// import {Module} from '@nestjs/common';
import {Module} from "nest-api-generator";
import {MyController} from "./controller.ts";

@Module({
    controllers: [MyController],
})
export class MyModule {}
```

### **controller.ts**

```ts
import {Controller, Query, Body} from "@nestjs/common";
import {
    Get,
    Post,
    Put,
    Delete,
    Param,
    ReturnType, // New Decorator
    Property, // New Decorator
} from "nest-api-generator";
import {MyController} from "./controller.ts";

//
class GetAllCustomerRequest {
    @Property("pageIndex", Number)
    pageIndex: number;

    @Property("pageSize", Number)
    pageSize: number;
}

class GetAllCustomerResponse {
    // name, type class, isArray
    @Property("customers", Customer, true)
    customers: Customers[];

    @Property("totalPage", Number)
    totalPage: number;

    @Property("totalCount", Number)
    totalCount: number;
}
//

@Controller("my_controller")
export class MyController {
    constructor(private readonly service: Service) {}

    @Get("/")
    @ReturnType(GetAllCustomerResponse)
    async getAllCustomer(@Query() myQuery: GetAllCustomerRequest): Promise<GetAllCustomerResponse> {
        return this.service.getAllCustomers(myQuery);
    }
}
```

**Here is what you might come up with.**

<hr>

## **Decorators**

Here are some decorators:

**Same Usage with NestJS/common**

-   Module
-   Get / Post / Put / Delete / Patch / Options / All / Head
-   Param

**Different Usage**

-   Property
-   Enumeration
-   ReturnType

### **Property**

Since Typescript Reflect does not recognize `interface` and `enum`,
all interface and enum are declared as `class`

This is a `key decorator` in order to make the api generation works.

**Props**

-   name\* (must be same as the property key)
-   type\* (Type Class) -> Boolean/ Number/ String/ Customer Property Class
-   isArray - Optional - boolean

```ts
import {Property} from "nest-api-generator";
// Request interface

// From
export interface GetOneCustomerRequest {
    user_id: number;
}

// To
export class GetOneCustomerRequest {
    @Property("user_id", Number)
    user_id: number;
}

// Customer
// From
export interface Customer {
    name: string;
    age: number;
    skills: string[];
}

// To
export class Customer {
    @Property("name", String)
    name: string;

    @Property("age", Number)
    age: number;

    @Property("skills", String, true)
    skills: string[];
}

// Response
// From
export interface GetOneCustomerResponse extends Customer {}

// To
export class GetOneCustomerResponse extends Customer {}
```

### **Enumeration**

Since Typescript Reflect does not recognize `interface` and `enum`,
all interface and enum are declared as `class`

```ts
import {Enumeration, Property} from "nest-api-generator";

// From
export enum KeyboardLayout {
    ALICE = "ALICE",
    ERGO = "ERGO",
    TKL = "TKL",
}

// To
@Enumeration()
export class KeyboardLayout {}
```

### **ReturnType**

Since all controller methods might return a Promise, which TypeScript Reflect does not understand what is inside the promise, so here is the ReturnType decorator

```ts
// Controller
import {Get, ReturnType, Param} from "nest-api-generator";
import {Controller} from "@nestjs/common";
// Declared above
import {GetOneCustomerRequest, GetOneCustomerResponse} from "./type";

@Controller("customer")
export class CustomerController {
    constructor(private readonly service: Service) {}

    @Get("/:user_id")
    @ReturnType(GetOneCustomerResponse)
    async getOneCustomer(@Param() request: GetOneCustomerRequest): Promise<GetOneCustomerResponse> {
        return this.service.getOneCustomer();
    }
}
```

## **API Generation Script**

In your Root Directory (where the src folder locates), create a folder call script, and create a file with any name, ts file.

**TypeScript Only**

> **TypeScript**: please install `ts-node`. <br> > **TypeScript**: please modify `tsconfig.build.json`

```ts
import {NestAPIGenerator} from "nest-api-generator";
import {AppModule} from "../src/app.module.ts";
import * as path from "path";

/**
 *  rootDirectory: directory that contains src/
 */
new NestAPIGenerator({
    appModule: AppModule,
    rootDirectory: path.join(__dirname, ".."),
}).run();
```

**Modify package.json**

```js
{
    "script": {
        // "build": "nest build",
        "build:api": "ts-node --project ./tsconfig.json ./script/xxxx.ts",
        "build": "yarn run build:api && nest build"
    }
}
```

**IMPORTANT**

**Modify tsconfig.build.json**

```js
{
    "extends": "./tsconfig.json",
    //   "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
    "exclude": ["node_modules", "test", "dist", "**/*spec.ts", "script"]
}
```

After code generation, you will see a folder called `nest-api/`, and inside there is a file called `api.txt`, which means that the API generation is completed.

## **API Fetching Endpoint Setup**

To provide an endpoint for fetching the generated API documentation, it is easy.

**Endpoint**
`http://localhost:3000/$globalPrefix/_system/api`

```ts
// app.module.ts
import {NestAPIModule} from "nest-api-generator";
// rest imports

@Module({
    imports: [
        NestAPIModule.forRoot({
            // The path you defined in API Generation Script section
            // directory only
            // '/nest-api' is no need
            path: path.join(__dirname, ".."),
        }),
    ],
})
export class AppModule {}
```

<hr>
