import { Component, OnInit } from '@angular/core';
import { AnimalService } from './animal.service';
import { forkJoin } from 'rxjs/index';
import { tap } from 'rxjs/internal/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-combining-streams',
  template: `
    <button (click)="randomize()" mat-raised-button color="accent">Randomize</button>
    <hr>
    <div class="images">
      <video controls *ngIf="isVideo(dog); else dogImage;" [src]="dog.url"></video>
      <ng-template #dogImage>
        <img *ngIf="dog" [src]="dog.url" alt="Random Dog">
      </ng-template>
      <img *ngIf="cat" [src]="cat" alt="Random Cat">
    </div>
  `,
  styles: [`
    .images {
      display: flex;
      align-items: center;
    }
    img {
      max-width: 500px;
    }
    img:not(:first-child) {
      margin-left: 15px;
    }
  `],
  providers: [AnimalService]
})

export class CombiningStreamsComponent implements OnInit {
  dog;
  cat;

  constructor(private animalService: AnimalService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
  }

  randomize() {
    forkJoin(this.animalService.getDog(), this.animalService.getCat())
      .pipe(tap(([dog, cat]) => {
        this.dog = dog;
        this.cat = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(cat));
      })).subscribe();
  }

  isVideo(dog) {
    return dog && dog.url.includes('mp4');
  }
}