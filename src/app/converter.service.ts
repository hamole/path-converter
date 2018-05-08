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

    static getBloodTestDates(firstLine: string): string[] {
        const datesString: string = (firstLine.slice(20));
        const bloodTestDates: string[] = [];
        for (let i = 0; i < datesString.length; i += 11) {
            const date: string = datesString.slice(i, i + 8);
            bloodTestDates.push(date);
        }
        return bloodTestDates;
    }

    static isUrine(toBeConverted: string): boolean {
        return _.includes(toBeConverted, 'URINE MICROSCOPY AND CULTURE');

    }

    static isBlood(toBeConverted: string): boolean {
        return _.includes(toBeConverted, 'Collection Date:');

    }

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

    processUrine(): string {
        return 'urine';
    }

    processBlood() {
        const lines: string[] = this.inputObject.input.split('\n');
        const bloodTestDates = ConverterService.getBloodTestDates(lines[0]);
        this.extractTestResults(lines, bloodTestDates);
        this.updateTestExcluded();
        this.shortenTestResultNames();
        this.buildResultString(this.testResults, bloodTestDates);
    }

    extractTestResults(lines: string[], bloodTestDates: string[]) {
        for (let i = 6; i < lines.length; i++) {
            const bloodTestName: string = lines[i].slice(0, 20).trim();
            for (let j = 0; j < bloodTestDates.length; j++) {
                const startPoint = 20 + j * 11;
                const endPoint = startPoint + 11;
                const bloodTestValue: string = lines[i].slice(startPoint, endPoint).trim();
                if (bloodTestValue) {
                    const testResult: TestResult = {
                        type: { name: bloodTestName, isExcluded: false },
                        value: bloodTestValue,
                        datePerformed: bloodTestDates[j]
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


    buildResultString(testResults: Array<TestResult>, dateStrings: string[]) {
        for (let i = 0; i < dateStrings.length; i++) {
            const testsByDate = _.filter(testResults, ['datePerformed', dateStrings[i]]);
            if (i > 0) {
                this.resultObject.resultString += '\n';
            }
            this.resultObject.resultString += dateStrings[i] + this.settingsService.delimiter;
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
