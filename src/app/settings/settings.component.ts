import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { ConverterService } from '../converter.service';
import { TestResult } from '../models/test-result';
import { TestType } from '../models/test-type';
import { ExcludeTypesService } from './exclude-types.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(public settingsService: SettingsService,
        public converterService: ConverterService,
        private excludeTypesService: ExcludeTypesService) {
    }

    ngOnInit() {

    }

    toggleTestResult(testType: TestType) {
        testType.isExcluded = !testType.isExcluded;
        this.excludeTypesService.updateExclusionStatus(testType);
        this.converterService.convertPathologyResults();
    }
}
