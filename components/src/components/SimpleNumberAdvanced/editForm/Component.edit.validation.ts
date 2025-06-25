import common from '../../Common/Advanced.edit.validation';
import NumberEditValidation from 'formiojs/components/number/editForm/Number.edit.validation';
import {reArrangeComponents} from '../../Common/function';

const neededposition = [
    'validate.isUseForCopy',
    'validateOn',
    'validate.required',
    'validate.min',
    'validate.max',
    'errorLabel',
    'validate.customMessage',
    'errors',
    'custom-validation-js',
    'json-validation-json'
];

// Add custom validation for incomplete numbers
const customValidationComponents = [
    {
        type: 'checkbox',
        input: true,
        key: 'validate.strictNumberValidation',
        label: 'Strict Number Validation',
        tooltip: 'Prevents submission of incomplete number inputs like "-" or "-."',
        weight: 105,
        defaultValue: true
    },
    {
        type: 'textfield',
        input: true,
        key: 'validate.incompleteNumberMessage',
        label: 'Incomplete Number Error Message',
        placeholder: 'Please enter a complete number',
        tooltip: 'Custom error message for incomplete number inputs',
        weight: 106,
        conditional: {
            show: true,
            when: 'validate.strictNumberValidation',
            eq: true
        }
    }
];

// Combine all validation components
const allValidationComponents = [
    ...NumberEditValidation,
    ...common,
    ...customValidationComponents
];

const newPosition = reArrangeComponents(neededposition, allValidationComponents);

export default newPosition;
