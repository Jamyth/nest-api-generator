export type DefinitionType = "interface" | "enum";

export interface TransformDataType {
    name: string;
    type: DefinitionType;
    isArray: boolean;
    nullableKeys: string[];
    body: Record<string, any>;
}

export enum RequestMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    ALL = "ALL",
}

export interface ControllerMethod {
    method: RequestMethod;
    name: string;
    path: string;
    pathParams: {name: string; type: string}[];
    pathParamInterface: any | null;
    requestType: any | null;
    responseType: any | null;
}

export interface MethodParameter {
    property: string | null;
    index: number;
}
