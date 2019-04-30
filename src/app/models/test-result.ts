import {TestType} from './test-type';
export class TestResult {
  type: TestType;
  value: string;
  datePerformed: Date;
  printed: Boolean = false;
}
