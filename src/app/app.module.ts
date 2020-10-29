import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserbaseService } from './userbase.service';

export const appInit = (userbaseService: UserbaseService) => {
  return () => userbaseService.initializeUserbase();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [UserbaseService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
