/**
 * Created by blake on 26/03/2017.
 */

import { Injectable } from '@angular/core';
import { ConverterService } from '../converter.service';
import * as _ from 'lodash';
import { TestResult } from '../models/test-result';

@Injectable()
export class SettingsService {
    delimiter = ' ';
    excludedTests: Array<string>;
    sortDescending = true;
    customFormatting = false;
    stripLH = false;
    format = `(FBE {Hb}/{WCC}/{Plt}) 
(UEC {Na}/{K}/{Chlor} Cr{Creat} eGFR{eGFR})
(LFT {ALP}/{GGT}/{ALT} Bili {Bili})
(CMP {Corr. Ca}/{Mg}/{Phos})
(CRP {CRP})`;

    constructor() {
      this.retrieveSettings();
    }

    retrieveSettings(){
      if(localStorage.getItem('delimiter') !== null){
        this.delimiter = JSON.parse(localStorage.getItem('delimiter'));
      }
      if(localStorage.getItem('excludedTests') !== null){
        this.excludedTests = JSON.parse(localStorage.getItem('excludedTests'));
      }
      if(localStorage.getItem('sortDescending') !== null){
        this.sortDescending = JSON.parse(localStorage.getItem('sortDescending'));
      }
      if(localStorage.getItem('customFormatting') !== null){
        this.customFormatting = JSON.parse(localStorage.getItem('customFormatting'));
      }
      if(localStorage.getItem('format') !== null){
        this.format = JSON.parse(localStorage.getItem('format'));
      }
      if(localStorage.getItem('stripLH') !== null){
        this.stripLH = JSON.parse(localStorage.getItem('stripLH'));
      }
    }

    updateSettings(){
      localStorage.setItem('delimiter', JSON.stringify(this.delimiter));
      if(this.excludedTests){
       localStorage.setItem('excludedTests', JSON.stringify(this.excludedTests));
      }
      localStorage.setItem('sortDescending', JSON.stringify(this.sortDescending));
      localStorage.setItem('customFormatting', JSON.stringify(this.customFormatting));
      localStorage.setItem('format', JSON.stringify(this.format));
      localStorage.setItem('stripLH', JSON.stringify(this.stripLH))
    }
    toggleSort() {
      this.sortDescending = !this.sortDescending;
      this.updateSettings();
    }
}
