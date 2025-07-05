declare module 'class-validator' {
  export function IsString(): PropertyDecorator;
  export function IsNotEmpty(): PropertyDecorator;
  export function IsUUID(): PropertyDecorator;
  export function MinLength(len: number): PropertyDecorator;
  export function IsOptional(): PropertyDecorator;
  export function IsBoolean(): PropertyDecorator;
}
