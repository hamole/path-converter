import {Component} from '@angular/core';
import {ConverterService} from './converter.service';
import {ShortTypesService} from './short-types.service';
import {ExcludeTypesService} from './settings/exclude-types.service';
import * as _ from 'lodash';
import {SettingsService} from './settings/settings.service';

@Component({
  selector: 'app-root',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  convertedResults: string;
  toBeConvertedResults: string;
  settings = false;

  constructor(public converterService: ConverterService) {

  }

  convertPathologyResults(): void {
    this.converterService.convertPathologyResults();
  }

  clearForm() {
    this.converterService.resultObject.resultString = '';
    this.converterService.inputObject.input = '';
    this.converterService.testResults = [];
    this.converterService.uniqueTestTypes = [];
  }

  toggleSettings() {
    this.settings = !this.settings;
  }
}
