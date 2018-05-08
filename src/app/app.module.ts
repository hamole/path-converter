
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {ClipboardModule} from 'ngx-clipboard';
import {InlineSVGModule} from 'ng-inline-svg';
import {SettingsComponent} from './settings/settings.component';
import {ConverterService} from './converter.service';
import {ShortTypesService} from './short-types.service';
import {ExcludeTypesService} from './settings/exclude-types.service';
import {SettingsService} from './settings/settings.service';
import {TestTypeFilterPipe} from './settings/test-type-filter.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    TestTypeFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
    InlineSVGModule
  ],
  providers: [ConverterService, ShortTypesService, ExcludeTypesService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
