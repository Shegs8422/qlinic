declare module "zod" {
  export const z: any;
  export type ZodTypeAny = any;
  export type infer<T extends any> = any;
  export function string(): any;
  export function number(): any;
  export function boolean(): any;
  export function object<Shape extends Record<string, any>>(shape: Shape): any;
  export function array<T>(schema: any): any;
  export function optional<T>(schema: any): any;
  export function nullable<T>(schema: any): any;
  export function union(...options: any[]): any;
  export function values<T extends string[]>(values: T): any;
  export function effects<T>(schema: any, effect: any): any;
}
