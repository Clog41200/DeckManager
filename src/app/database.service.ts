import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public MesCartes: any;
  public MesDecks: any;

  constructor(private el: ElectronService) {
    this.MesCartes = this.el.remote.getGlobal('MesCartes');
    this.MesDecks = this.el.remote.getGlobal('MesDecks');
  }
}
