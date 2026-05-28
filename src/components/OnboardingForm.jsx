import React, { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import axios from 'axios';

const OnboardingForm = ({ onDeploy }) => {
  const [state, setState] = useState({
    clientName: '',
    domain: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/deploy`, state);
      if (response.data.deploymentId) {
        onDeploy(response.data.deploymentId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during deployment');
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <div className="status-header">
        <h1>New Deployment</h1>
        <p className="subtitle">Configure and launch your client's container.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            className="form-control"
            placeholder="Client Name"
            value={state.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="domain">Custom Domain</label>
          <input
            type="text"
            id="domain"
            name="domain"
            className="form-control"
            placeholder="Domain name"
            value={state.domain}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Docker Image</label>
          <input
            type="text"
            id="image"
            name="image"
            className="form-control"
            placeholder="Docker Image"
            value={state.image}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Rocket />}
          {loading ? 'Initializing...' : 'Deploy Now'}
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;
