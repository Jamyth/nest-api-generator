export declare type DefinitionType = "interface" | "enum";
export interface TransformDataType {
    name: string;
    type: DefinitionType;
    isArray: boolean;
    body: Record<string, any>;
}
export declare enum RequestMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    ALL = "ALL"
}
export interface ControllerMethod {
    method: RequestMethod;
    name: string;
    path: string;
    pathParams: {
        name: string;
        type: string;
    }[];
    requestType: any | null;
    responseType: any | null;
}
export interface MethodParameter {
    property: string | null;
    index: number;
}
