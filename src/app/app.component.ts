import { DatabaseService } from './database.service';
import { Component, NgZone } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
    rouge: new FormControl(false),
    vert: new FormControl(false),
    bleue: new FormControl(false),
    blanc: new FormControl(false),
    noir: new FormControl(false),
    manaCost: new FormControl(0),
    Common: new FormControl(false),
    Uncommon: new FormControl(false),
    Rare: new FormControl(false),
    MythicRare: new FormControl(false),
    Special: new FormControl(false),
    BasicLand: new FormControl(false)
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
      });
    });
  }

  getCount(card: any) {
    return this.mescartes.filter(carte => carte.id === card.id).length;
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
    const couleurs = [];
    const rarity = [];
    if (this.form.value.rouge) {
      couleurs.push('R');
    }
    if (this.form.value.vert) {
      couleurs.push('G');
    }
    if (this.form.value.noir) {
      couleurs.push('B');
    }
    if (this.form.value.blanc) {
      couleurs.push('W');
    }
    if (this.form.value.bleue) {
      couleurs.push('U');
    }

    if (this.form.value.Common) {
      rarity.push('Common');
    }
    if (this.form.value.Uncommon) {
      rarity.push('Uncommon');
    }
    if (this.form.value.Rare) {
      rarity.push('Rare');
    }
    if (this.form.value.MythicRare) {
      rarity.push('Mythic Rare');
    }
    if (this.form.value.Special) {
      rarity.push('Special');
    }
    if (this.form.value.BasicLand) {
      rarity.push('Basic Land');
    }

    this.httpclient
      .get('https://api.magicthegathering.io/v1/cards', {
        params: {
          name: recherche,
          language: 'French',
          contains: 'imageUrl',
          colorIdentity: couleurs,
          cmc: this.form.value.manaCost,
          rarity: rarity
        }
      })
      .subscribe(resultat => (this.results = (resultat as any).cards));
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
