import { IsInt, IsPositive, IsString, isURL, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    url: string;
}
