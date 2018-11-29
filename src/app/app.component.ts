import { DatabaseService } from './database.service';
import { Component, NgZone } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public mescartes: any[];
  public results: any[];
  public form = new FormGroup({
    motcle: new FormControl(''),
    colors: new FormControl([]),
    rarity: new FormControl([]),
    manaCost: new FormControl(''),
    possedee: new FormControl(false)
  });

  constructor(
    private httpclient: HttpClient,
    private el: ElectronService,
    private db: DatabaseService,
    private ngzone: NgZone
  ) {
    this.GetMyCards();
  }

  GetMyCards() {
    this.db.MesCartes.find({}, (err, docs) => {
      this.ngzone.run(() => {
        this.mescartes = docs;
        this.updateCount();

      });
    });
  }

  ajouterCarte(card: any) {
    this.db.MesCartes.insert(card, (err, doc) => {
      this.GetMyCards();
    });
  }

  retirerCarte(card: any) {
    this.db.MesCartes.remove({ _id: card._id }, () => {
      this.GetMyCards();
    });
  }

  onSubmit() {
    const recherche = this.form.value.motcle;
    const couleurs = this.form.value.colors;
    const rarity = this.form.value.rarity;
    console.log(this.form.value.colors);

    let param = new HttpParams();
    if (recherche !== '') {
      param = param.append('name', recherche);
      param = param.append('language', 'French');
    }
    if (this.form.value.manaCost !== '') {
      param = param.append('cmc', this.form.value.manaCost);
    }

    param = param.append('contains', 'imageUrl');
    if (couleurs.length > 0) {
      param = param.append('colorIdentity', couleurs);
    }
    if (rarity.length > 0) {
      param = param.append('rarity', rarity);
    }

    this.httpclient
      .get<any>('https://api.magicthegathering.io/v1/cards', {
        params: param
      })
      .subscribe(resultat => {
        this.results = resultat.cards;
        this.updateCount();
      });
  }

  updateCount() {
    for (const carte of this.results) {
      carte.combien = this.mescartes.filter(lacarte => lacarte.id === carte.id).length;
    }
  }

  getFrenchName(card: any) {
    if (card.foreignNames) {
      const foreign = card.foreignNames.filter(
        foreign => foreign.language === 'French'
      );
      if (foreign[0] !== undefined) {
        return foreign[0].name;
      } else {
        return card.name;
      }
    } else {
      return card.name;
    }
  }

  getFrenchUrl(card: any) {
    if (card.foreignNames) {
      const foreign = card.foreignNames.filter(
        foreign => foreign.language === 'French'
      );
      if (foreign[0] !== undefined) {
        return foreign[0].imageUrl;
      } else {
        return card.imageUrl;
      }
    } else {
      return card.imageUrl;
    }
  }
}
