import stepperReducer, {
    setActiveStep,
    setMaxVisitedStep,
    setStepData,
    setAllFormData,
    setErrors,
    setIsSubmitted,
    setSubmissionId,
    resetStepper,
} from '../stepperSlice';

describe('stepperSlice', () => {
    const initialState = {
        activeStep: 2,
        maxVisitedStep: 2,
        formData: {},
        errors: {},
        isSubmitted: false,
        submissionId: '',
    };

    test('should return the initial state', () => {
        expect(stepperReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('should handle setActiveStep', () => {
        const actual = stepperReducer(initialState, setActiveStep(3));
        expect(actual.activeStep).toEqual(3);
    });

    test('should handle setMaxVisitedStep', () => {
        const actual = stepperReducer(initialState, setMaxVisitedStep(3));
        expect(actual.maxVisitedStep).toEqual(3);

        // Should not decrease maxVisitedStep
        const actual2 = stepperReducer(actual, setMaxVisitedStep(1));
        expect(actual2.maxVisitedStep).toEqual(3);
    });

    test('should handle setStepData', () => {
        const actual = stepperReducer(initialState, setStepData({ step: 1, data: { foo: 'bar' } }));
        expect(actual.formData[1]).toEqual({ foo: 'bar' });
    });

    test('should handle setAllFormData', () => {
        const formData = { 1: { foo: 'bar' }, 2: { baz: 'qux' } };
        const actual = stepperReducer(initialState, setAllFormData(formData));
        expect(actual.formData).toEqual(formData);
    });

    test('should handle setErrors', () => {
        const errors = { field: 'error' };
        const actual = stepperReducer(initialState, setErrors(errors));
        expect(actual.errors).toEqual(errors);
    });

    test('should handle setIsSubmitted', () => {
        const actual = stepperReducer(initialState, setIsSubmitted(true));
        expect(actual.isSubmitted).toEqual(true);
    });

    test('should handle setSubmissionId', () => {
        const actual = stepperReducer(initialState, setSubmissionId('123'));
        expect(actual.submissionId).toEqual('123');
    });

    test('should handle resetStepper', () => {
        const modifiedState = {
            activeStep: 5,
            maxVisitedStep: 5,
            formData: { 1: { foo: 'bar' } },
            errors: { field: 'error' },
            isSubmitted: true,
            submissionId: '123',
        };
        const actual = stepperReducer(modifiedState, resetStepper());
        expect(actual).toEqual(initialState);
    });
});
