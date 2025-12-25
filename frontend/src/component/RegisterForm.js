import { useState } from "react";


// Import all step components
import Step1 from "./Step1";
import Step10 from "./Step10";
import Step11 from "./Step11";
import Step12 from "./Step12";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Go to next step and merge data
  const nextStep = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  // Go to previous step
  const prevStep = () => setStep(step - 1);

  // Render steps
  switch (step) {
    case 1:
      return <Step1 nextStep={nextStep} formData={formData} />;
    case 2:
      return (
        <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 3:
      return (
        <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 4:
      return (
        <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 5:
      return (
        <Step5 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 6:
      return (
        <Step6 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 7:
      return (
        <Step7 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 8:
      return (
        <Step8 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 9:
      return (
        <Step9 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 10:
      return (
        <Step10 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 11:
      return (
        <Step11 nextStep={nextStep} prevStep={prevStep} formData={formData} />
      );
    case 12:
      return <Step12 prevStep={prevStep} formData={formData} />;
    default:
      return <div>Invalid Step</div>;
  }
}
