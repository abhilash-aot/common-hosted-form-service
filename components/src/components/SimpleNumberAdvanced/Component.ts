// Component.ts - Enhanced with proper validation
/* tslint:disable */
import { Components } from 'formiojs';
const ParentComponent = (Components as any).components.number;
import editForm from './Component.form';

import { Constants } from '../Common/Constants';

const ID = 'simplenumberadvanced';
const DISPLAY = 'Number';

export default class Component extends (ParentComponent as any) {
    // Track when we should validate
    private shouldValidate: boolean = false;

    static schema(...extend) {
        return ParentComponent.schema({
            type: ID,
            label: DISPLAY,
            key: ID,
            validate: {
                min: '',
                max: '',
                step: 'any',
                integer: ''
            }
        }, ...extend);
    }

    public static editForm = editForm;

    static get builderInfo() {
        return {
            title: DISPLAY,
            group: 'advanced',
            icon: 'hashtag',
            weight: 750,
            documentation: Constants.DEFAULT_HELP_LINK,
            schema: Component.schema()
        };
    }

    // Override the getValue method to handle incomplete inputs only during validation/submission
    getValue() {
        let value = super.getValue();

        // Check if we have an incomplete number input
        if (this.refs?.input?.length && this.refs.input[0]) {
            const inputValue = this.refs.input[0].value;
            if (typeof inputValue === 'string' && this.isIncompleteNumber(inputValue.trim())) {
                // During submission or validation, treat incomplete numbers as null
                const isValidating = this.root?.submitting || this.options?.validateOn === 'submit' || this.shouldValidate;
                if (isValidating) {
                    return null;
                }
                // During normal operation, return the raw value to allow typing
                return inputValue;
            }
        }

        return value;
    }

    // Helper method to detect incomplete number inputs
    isIncompleteNumber(value: string): boolean {
        if (!value) return false;

        // Patterns that represent incomplete numbers
        const incompletePatterns = [
            /^-$/,          // Just a minus sign
            /^-\.$/,        // Minus followed by decimal point
            /^\.$/,         // Just a decimal point
            /^-\.$|^\.-$/,  // Various incomplete decimal patterns
            /^[+-]?\.$/,    // Plus/minus with just decimal
            /^[+-]?$|^[+-]\s*$/ // Just plus or minus with optional whitespace
        ];

        return incompletePatterns.some(pattern => pattern.test(value));
    }

    // Override the validation with proper context handling
    validateValue(value: any, data: any, index?: number): any {
        // Check if we have an incomplete number in the input field
        if (this.refs?.input?.length && this.refs.input[index || 0]) {
            const inputValue = this.refs.input[index || 0].value;
            if (typeof inputValue === 'string' && this.isIncompleteNumber(inputValue.trim())) {
                // For required fields, treat incomplete numbers as missing values
                if (this.component.validate?.required) {
                    return this.t('{{field}} is required.', {
                        field: this.errorLabel || this.label || this.key
                    });
                }
                // For non-required fields, it's valid (will be treated as null)
                return true;
            }
        }

        // Call parent validation with the processed value
        return super.validateValue(value, data, index);
    }

    // Override getValueAt to handle incomplete inputs during submission
    getValueAt(index: number = 0): any {
        const value = super.getValueAt(index);

        // Only modify behavior during submission to avoid interfering with typing
        const isSubmitting = this.root?.submitting || this.options?.validateOn === 'submit';

        if (isSubmitting && this.refs?.input?.length && this.refs.input[index]) {
            const inputValue = this.refs.input[index].value;
            if (typeof inputValue === 'string' && this.isIncompleteNumber(inputValue.trim())) {
                return undefined;
            }
        }

        return value;
    }

    // Override blur event to validate on focus loss - but only clear, don't validate required
    addInputEventListener(input: any) {
        super.addInputEventListener(input);

        // Add blur event to handle incomplete numbers without triggering required validation
        this.addEventListener(input, 'blur', () => {
            const inputValue = input.value;
            if (typeof inputValue === 'string' && this.isIncompleteNumber(inputValue.trim())) {
                // Only clear the input, don't trigger validation
                input.value = '';
                this.updateValue(null, {
                    modified: true
                });
                // Don't call checkValidity here to avoid premature required validation
            }
        });

        // Add custom input event to allow typing but prevent invalid final states
        this.addEventListener(input, 'input', () => {
            // Clear any existing error state when user starts typing
            if (this.hasError) {
                this.setCustomValidity('');
            }
        });
    }

    // Override the normalizeValue method to handle edge cases
    normalizeValue(value: any): any {
        // Handle string inputs that might be incomplete
        if (typeof value === 'string') {
            const trimmedValue = value.trim();

            // Return null for incomplete numbers
            if (this.isIncompleteNumber(trimmedValue)) {
                return null;
            }

            // Handle empty string
            if (trimmedValue === '') {
                return null;
            }
        }

        return super.normalizeValue(value);
    }

    // Simplified checkValidity override
    checkValidity(data?: any, dirty?: boolean, row?: any): boolean {
        this.shouldValidate = true;

        // Check for incomplete numbers during validation
        if (this.refs?.input?.length && this.refs.input[0]) {
            const inputValue = this.refs.input[0].value;
            if (typeof inputValue === 'string' && this.isIncompleteNumber(inputValue.trim())) {
                if (this.component.validate?.required) {
                    this.setCustomValidity(this.t('{{field}} is required.', {
                        field: this.errorLabel || this.label || this.key
                    }));
                    this.shouldValidate = false;
                    return false;
                }
            }
        }

        const result = super.checkValidity(data, dirty, row);
        this.shouldValidate = false;
        return result;
    }

    // Remove the beforeSubmit method as it's not a standard FormIO method
    // Instead, override the submit-related validation
}
