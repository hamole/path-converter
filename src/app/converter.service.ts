import { SettingsService } from './settings/settings.service';
import { Injectable } from '@angular/core';
import { TestResult } from './models/test-result';
import * as _ from 'lodash';
import { ShortTypesService } from './short-types.service';
import { ExcludeTypesService } from './settings/exclude-types.service';
import { ResultObject } from './models/result-object';
import { InputObject } from './models/input-object';
import { TestType } from './models/test-type';

@Injectable()
export class ConverterService {

    constructor(private shortTypesService: ShortTypesService, private excludeTypesService: ExcludeTypesService,
         private settingsService: SettingsService) {
    }

    testResults: Array<TestResult> = [];
    inputObject: InputObject = { input: '' };
    resultObject: ResultObject = { resultString: '' };
    uniqueTestTypes: Array<TestType> = [];
    sectionDate: Date[][] = [];
    sections: Array<number> = [];
    // Entry point to conversion
    convertPathologyResults() {
      this.testResults = [];
      this.resultObject.resultString = '';
      this.uniqueTestTypes = [];
      if (ConverterService.isUrine(this.inputObject.input)) {
        this.processUrine();
      } else if (ConverterService.isBlood(this.inputObject.input)) {
        this.processBlood();
      }
    }

     getBloodTestDates(lines: string[], sections: number[]) {
        for(let i = 0; i < sections.length - 1; i++)
        {
            this.sectionDate[i] = [];
            const datesString: string = (lines[sections[i]].slice(20));
            const timesString: string = (lines[sections[i]+1].slice(20));
            for (let j = 0, k = 0; j < datesString.length; j += 11, k++) {
              const dateS: string = datesString.slice(j, j + 8);
              const dateParts: string[] = dateS.split('/');
              const timeS: string = timesString.slice(j, j + 5);
              const timeParts: string[] = timeS.split(':');
              const date: Date = new Date(+`20${dateParts[2]}`, +dateParts[1] - 1, +dateParts[0],+timeParts[0], +timeParts[1])
              this.sectionDate[i][k] = date;
            }
        }
    }

    getSectionforLine(line: number): number{
      for(let i = 0; i < this.sections.length - 1; i++){
          if(line > this.sections[i] && line <= this.sections[i+1]){
            return i;
          }
      }
      return -1;
    }

    static isUrine(toBeConverted: string): boolean {
        return _.includes(toBeConverted, 'URINE MICROSCOPY AND CULTURE');

    }

    static isBlood(toBeConverted: string): boolean {
        return _.includes(toBeConverted, 'Collection Date:');

    }

    processUrine(): string {
        return 'urine';
    }

    getSectionIndexs(lines: string[]): Array<number> {
      let indexs = [];
      for(let i = 0; i < lines.length; i++){
        if(_.includes(lines[i], 'Collection Date:')){
          indexs.push(i);
        }
      }
      indexs.push(lines.length - 1);
      return indexs
    }

    processBlood() {
        const lines: string[] = this.inputObject.input.split('\n');
        this.sections = this.getSectionIndexs(lines);
        this.getBloodTestDates(lines, this.sections);
        this.extractTestResults(lines,this.sections);
        this.updateTestExcluded();
        this.shortenTestResultNames();
        this.buildResultString(this.testResults);
    }


    validTest(testName, testValue): boolean{
      if(!testName || !testValue){
        return false;
      }
      const nonTests = [
        'Procedures completed',
        'All othe',
        'Report authorised by',
        'Comments on laborato'
      ]
      const checkValue = testValue.replace(/[^\d.-]/g, '');
      if(checkValue == '' || _.includes(testValue, ':') || _.includes(testName, ':') || isNaN(checkValue as any)){
        return false;
      }
      if(nonTests.indexOf(testName) > -1) {
        return false;
      }
      return true;
    }

    extractTestResults(lines: string[],sections: number[]) {
        for (let i = sections[0]; i < lines.length; i++) {
            const bloodTestName: string = lines[i].slice(0, 20).trim();
            const section = this.getSectionforLine(i);
            if(section === -1) {
              continue;
            }
            for (let j = 0; j < this.sectionDate[section].length; j++) {
                const startPoint = 20 + j * 11;
                const endPoint = startPoint + 11;
                const bloodTestValue: string = lines[i].slice(startPoint, endPoint).trim();
                if (this.validTest(bloodTestName,bloodTestValue)) {
                    const testResult: TestResult = {
                        type: { name: bloodTestName, isExcluded: false },
                        value: bloodTestValue,
                        datePerformed: this.sectionDate[section][j]
                    };
                    this.testResults.push(testResult);
                }
            }
        }
    }

    updateTestExcluded() {
        _.forEach(this.testResults, (testResult) => {
            const existingTypePreference = _.find(this.excludeTypesService.excludedTypes, (testType) => {
                return testResult.type.name === testType.name;
            });
            if (existingTypePreference) {
                testResult.type.isExcluded = existingTypePreference.isExcluded;
            }
        });
    }

    shortenTestResultNames() {
        _.forEach(this.testResults, (testResult: TestResult) => {
            testResult.type.shortName = this.shortTypesService.getShortType(testResult.type.name);
        });
    }

    getDateString(date: Date, dates: Date[]){
      let dateString = `${date.getDate()}/${date.getMonth() + 1}`
      for(const d of dates) {
        if(d.toDateString() === date.toDateString() && d !== date){
          dateString += ` @ ${date.getHours() > 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()}`;
          break;
        }
      }
      return dateString + ':';
    }

    flattenDates(mdArray): Date[] {
      let sArray: Date[] = [];
      let compareArray =[];
      for(var i = 0; i < mdArray.length; i++) {
        for (let j = 0; j < mdArray[i].length; j++) {
          if (compareArray.indexOf(mdArray[i][j].valueOf()) > -1) {
            continue;
          }
          compareArray = compareArray.concat(mdArray[i][j].valueOf());
        }
      }
      for(let i = 0; i < compareArray.length; i++){
        sArray.push(new Date(compareArray[i]));
      }
      return sArray;
    }
    sortDates(dates: Date[]): Date[] {
      return dates.sort((a: Date, b: Date) => {
        if(this.settingsService.sortDescending) {
          return b.getTime() - a.getTime();
        } else {
          return a.getTime() - b.getTime();
        }
      });
    }

    buildResultString(testResults: Array<TestResult>) {
        const dates = this.sortDates(this.flattenDates(this.sectionDate))
        for (let i = 0; i < dates.length; i++) {
            const testsByDate = _.filter(testResults, ['datePerformed', dates[i]]);
            if (i > 0) {
                this.resultObject.resultString += '\n';
            }
            this.resultObject.resultString += this.getDateString(dates[i], dates) + this.settingsService.delimiter;
            for (let j = 0; j < testsByDate.length; j++) {
                const testResult = testsByDate[j];
                if (!testResult.type.isExcluded) {
                    this.resultObject.resultString += testResult.type.shortName + ' ' + testResult.value;
                    if (j !== testsByDate.length - 1) {
                        this.resultObject.resultString += this.settingsService.delimiter;
                    }
                }
            }
        }
    }
}
