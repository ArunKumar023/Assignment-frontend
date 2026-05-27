import React, { useState } from 'react';
import OnboardingForm from './components/OnboardingForm';
import LiveStatusDashboard from './components/LiveStatusDashboard';

function App() {
  const [activeDeploymentId, setActiveDeploymentId] = useState(null);

  const handleDeploy = (deploymentId) => {
    setActiveDeploymentId(deploymentId);
  };

  const handleNewDeployment = () => {
    setActiveDeploymentId(null);
  };

  return (
    <>
      {!activeDeploymentId ? (
        <OnboardingForm onDeploy={handleDeploy} />
      ) : (
        <LiveStatusDashboard 
          deploymentId={activeDeploymentId} 
          onNewDeployment={handleNewDeployment} 
        />
      )}
    </>
  );
}

export default App;
