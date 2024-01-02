import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl:string = environments.baseUrl;

  constructor(private http: HttpClient) { }


  createCredentials(): HttpHeaders {

    const username:string = 'usertest';
    const password:string = '123456';

    const base64Credentials = btoa(`${username}:${password}`);
    // Crear el encabezado de autorización
    const headers = new HttpHeaders({
      'Authorization': `Basic ${base64Credentials}`
    });
    return headers;
  }

  getHeroes():Observable<Hero[]> {

    const headers = this.createCredentials();

    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`, {headers: headers});
  }

  getHeroById(id: string): Observable<Hero | undefined>{

    const headers = this.createCredentials();

    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`, {headers: headers})
            .pipe(
              catchError(error => of(undefined))
            );
  }

  getSuggestions(query: string): Observable<Hero[]>{

    const headers = this.createCredentials();

    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${query}&_limit=6`, {headers: headers});
  }

  addHero(hero: Hero): Observable<Hero> {

    const headers = this.createCredentials();

    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero, {headers: headers});
  }

  updateHero(hero: Hero): Observable<Hero> {

    if(!hero.id) throw Error('Hero id is required');

    const headers = this.createCredentials();

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${ hero.id }`, hero, {headers: headers});
  }

  deletHeroById(id: string): Observable<boolean> {

    const headers = this.createCredentials();

    return this.http.delete(`${this.baseUrl}/heroes/${ id }`, {headers: headers})
            .pipe(
              map(resp => true),
              catchError(err => of(false))
            );
  }



}
