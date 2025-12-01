import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { setStepData } from '../stepperSlice';

interface StepWrapperProps {
  step: number;
  component: React.ComponentType<any>;
}

const StepWrapper: React.FC<StepWrapperProps> = ({ step, component: Component }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.stepper.formData);
  const errors = useSelector((state: RootState) => state.stepper.errors);
  const currentStepData = formData[step] || {};

  const handleChange = (newData: any) => {
    dispatch(setStepData({ step, data: newData }));
  };

  return (
    <Component
      data={currentStepData}
      onChange={handleChange}
      errors={errors}
    />
  );
};

export default StepWrapper;
