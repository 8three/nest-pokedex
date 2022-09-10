import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interfaces';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executetdSeed() {
    const data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    try {
      await this.pokemonModel.deleteMany({});
      const pokemons: CreatePokemonDto[] = [];
      data.results.forEach(({name, url}) => {
        const segments = url. split('/');
        const no = +segments[segments.length -2];
        const pokemonDto: CreatePokemonDto= { no, name };
        pokemons.push(pokemonDto);
      });
      await this.pokemonModel.insertMany(pokemons);
      /* const arrayPromises = [];
      data.results.forEach( async ({name, url}) => {
        const segments = url. split('/');
        const no = +segments[segments.length -2];
        const pokemonDto: CreatePokemonDto= { no, name, url};
        // await this.pokemonModel.create(pokemonDto);
        arrayPromises.push(this.pokemonModel.create(pokemonDto));
      });
      await Promise.all(arrayPromises); */
      return 'Seed executed!';
    } catch(error) {
      throw new InternalServerErrorException(error);
    }
  }
}
