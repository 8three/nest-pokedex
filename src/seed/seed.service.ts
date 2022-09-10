import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interfaces';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}
  private readonly axios: AxiosInstance = axios;

  async executetdSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');
    try {
      data.results.forEach( async ({name, url}) => {
        const segments = url. split('/');
        const no = +segments[segments.length -2];
        const pokemonDto: CreatePokemonDto= { no, name, url};
        await this.pokemonModel.create(pokemonDto);
      });
      return 'Seed executed!';
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }
}
