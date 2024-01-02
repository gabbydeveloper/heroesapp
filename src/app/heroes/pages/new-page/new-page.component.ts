import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { delay, filter, switchMap, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})

export class NewPageComponent implements OnInit {


  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl<string>(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  public pageTitle:string = '';

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialago: MatDialog
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {

    if(!this.router.url.includes('edit')){
      this.pageTitle = 'Añadir nuevo héroe';
      return;
    }

    this.activatedRoute.params
      .pipe(
        delay(100),
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      )
      .subscribe((hero) => {
        if(!hero) return this.router.navigateByUrl('/');
        this.pageTitle = `Editando a ${ hero.superhero }`;
        this.heroForm.reset(hero);
        return;
      });
  }

  onSubmit():void {
    if(!this.heroForm.valid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${ hero.superhero } updated!`);
        });
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['heroes/edit', hero.id]);
        this.showSnackBar(`${ hero.superhero } created!`);
      })

  }


  onDeleteHero():void {
    if(!this.currentHero.id) throw Error('Hero is required');

    const dialogRef = this.dialago.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deletHeroById(this.currentHero.id)),
        filter((wasDeleted:boolean) => wasDeleted)
      )
      .subscribe(() =>{
        this.router.navigate(['/heroes']);
    });

    // dialogRef.afterClosed().subscribe(result =>{
    //   if(!result) return;

    //   this.heroesService.deletHeroById(this.currentHero.id)
    //     .subscribe(wasdeleted => {
    //       if(wasdeleted) this.router.navigate(['/heroes']);
    //       return;
    //     });
    // });

  }

  showSnackBar(message:string):void {
    this.snackBar.open(message, 'done', {
      duration: 2500
    });
  }

}
