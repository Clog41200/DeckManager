import { DatabaseService } from './database.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxElectronModule } from 'ngx-electron';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule, MatButtonModule, MatInputModule, MatFormFieldModule} from '@angular/material';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxElectronModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule {}
