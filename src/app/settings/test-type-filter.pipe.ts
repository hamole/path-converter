/**
 * Created by blake on 30/03/2017.
 */
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TestType } from '../models/test-type';
import { TestResult } from '../models/test-result';
import * as _ from 'lodash';
@Pipe({
    name: 'testTypeFilter'
})
@Injectable()
export class TestTypeFilterPipe implements PipeTransform {
    transform(testResults: Array<TestResult>): any {
        // filter items array, items which match and return true will be kept, false will be filtered out
        return _.uniqBy(testResults, (testResult) => {
            return testResult.type.name;
        });
    }
}
