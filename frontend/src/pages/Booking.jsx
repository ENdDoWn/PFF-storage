import { useState } from "react";

import Header from "../components/user/Header"
import State1 from "../components/user/StateOne"
import State2 from "../components/user/StateTwo"
import State3 from "../components/user/StateThree"

function Booking() {
  const [step, setStep] = useState(1);

  return (
    <div>
      <Header />
      <div>
        {step === 1 && <State1 onNext={() => setStep(2)} />}
        {step === 2 && (
          <State2
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && <State3 onBack={() => setStep(2)} />}
      </div>
    </div>
  );
}

export default Booking;
