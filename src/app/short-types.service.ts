import { Injectable } from '@angular/core';
@Injectable()
export class ShortTypesService {
    shortNames = {
        'Sodium': 'Na',
        'Potassium': 'K',
        'Chloride': 'Chlor',
        'Bicarbonate': 'Bicarb',
        'Creatinine': 'Creat',
        'Creatine Kinase': 'CK',
        'Troponin I': 'Trop',
        'Corrected Ca': 'Corr. Ca',
        'Calcium': 'Ca',
        'Magnesium': 'Mg',
        'Phosphate': 'Phos',
        'Albumin': 'Alb',
        'Haemoglobin': 'Hb',
        'White cell count': 'WCC',
        'Platelet count': 'Plt',
        'Neutrophils': 'Neuts',
        'CRP (Sensitive)': 'CRP',
        'Total Bilirubin': 'Bili'
    };

    getShortType(testName: string) {
        return this.shortNames[testName] || testName;
    }
}
