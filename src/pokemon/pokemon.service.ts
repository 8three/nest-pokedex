import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExecptions(error);
    }
  }

  findAll() {
    return this.pokemonModel.find({});
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase()});
    }
    if (!pokemon) {
      throw new NotFoundException(`No existe el pokemon con no, id o name: ${term}`);
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      
      if (pokemon.name) {
        pokemon.name = pokemon.name.toLowerCase();
      }
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto, {new: true});
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto
      }
    } catch (error) {
      this.handleExecptions(error);
    }

  }

  async remove(id: string) {
    const {acknowledged,deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return;
  }

  handleExecptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Error: ya existe un pokemon con ese no o name: ${ JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Internal server error: revise sus logs`);
  }
}
