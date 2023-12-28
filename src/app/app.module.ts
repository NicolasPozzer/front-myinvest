import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuiComponent } from './components/gui/gui.component';
import { HomeComponent } from './components/home/home.component';
import { ListadoInversionesComponent } from './components/listado-inversiones/listado-inversiones.component';

@NgModule({
  declarations: [
    AppComponent,
    GuiComponent,
    HomeComponent,
    ListadoInversionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withFetch()), provideClientHydration()],
  bootstrap: [AppComponent]
})
export class AppModule { }
