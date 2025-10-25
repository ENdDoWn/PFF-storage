import { useState } from "react";

import Header from "../components/user/Header"
import State2 from "../components/user/StateTwo"
import State3 from "../components/user/StateThree"

function Booking() {
  const [step, setStep] = useState(1);

  return (
    <div>
      <Header isAuthenticated={true} />
      <div>
        {step === 1 && (
          <State2
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && <State3 onBack={() => setStep(1)} />}
      </div>
    </div>
  );
}

export default Booking;
