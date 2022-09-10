import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';

@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;

  async executetdSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?offset=650?limit=504');
    const results = data.results.map( ({name, url}) => {
      const segments = url. split('/');
      const number = +segments[segments.length -2]
      return {
        number,
        name,
        url
      }
      
    });
    return results;
  }
}
