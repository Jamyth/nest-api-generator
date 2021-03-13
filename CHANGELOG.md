Version 1.0.0

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.11] - 2021-03-13

### Fix

-   Remove generated string with " \ /

## [1.2.10] - 2021-03-13

### Changed

-   tsconfig.build.json
    -   change target from es2020 to es2015

## [1.2.8] - 2021-03-13

### Added

-   **Decorators**
    -   Nullable
        -   Some property might be `string | null`

### Changed

-   util & script/generate.ts
    -   update methods to support Nullable Decorator
-   MetaData.ts
    -   added new metadata type

## [1.2.7] - 2021-03-13

### Changed

-   util/createControllerMethod
    -   Accept multiple parameters
-   util/transformDataType
    -   Allow method return undefined
    -   Prevent nestjs build-in ParameterDecorator pollute the generation

## [1.2.6] - 2021-03-13

### Changed

-   update script/build.ts
    -   change version number after build

### Fixed

-   remove console.log in generate.ts
-   uncomment write file method in generate.ts

## [1.2.4] - 2021-03-13

### Change

-   Include dist folder in repo, fix yarn publish issue
-   util/createControllerMethod fix pathParams return undefined

## [1.2.0] - 2021-03-13

### Added

-   **Decorators**
    -   Param
-   **Development**
    -   Added Eslint
    -   Added Prettier
-   **Miscellaneous**
    -   Added LICENSE
    -   Added README.md

### Changed

-   Rename Controller.ts to Module.ts (typo)
-   script/generate.ts
    -   fix controllers might return undefined

## [1.0.0] - 2021-03-12

### Added

-   **Decorators**
    -   Request Method Decorators
    -   Enumeration
    -   Module
    -   Property
    -   ReturnType
-   **NestJS Module**
    -   A module with an endpoint to fetch generated api
-   **script**
    -   A class for api generation
