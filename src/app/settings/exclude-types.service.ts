import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TestType } from '../models/test-type';

@Injectable()
export class ExcludeTypesService {

    excludedTypes: Array<TestType> = [
        { name: 'Red cell count', isExcluded: true },
        { name: 'Haematocrit', isExcluded: true },
        { name: 'MCH', isExcluded: true },
        { name: 'MCHC', isExcluded: true },
        { name: 'MPV', isExcluded: true },
        { name: 'Lymphocytes', isExcluded: true },
        { name: 'Monocytes', isExcluded: true },
        { name: 'Basophils', isExcluded: true },
        { name: 'Eosinophils', isExcluded: true },
        { name: 'RDW', isExcluded: true }
    ];

    updateExclusionStatus(testType: TestType) {
        if (!_.some(this.excludedTypes, { name: testType.name })) {
            this.excludedTypes.push(testType);
        } else {
            const existingTestType: TestType = _.find(this.excludedTypes, { name: testType.name });
            existingTestType.isExcluded = !existingTestType.isExcluded;
            console.log(this.excludedTypes);
        }
    }
}
