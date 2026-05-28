import React, { useState, useEffect, useRef } from 'react';
import { Server, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const LiveStatusDashboard = ({ deploymentId, onNewDeployment }) => {
  const [status, setStatus] = useState('Pending');
  const [deploymentData, setDeploymentData] = useState(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/status/${deploymentId}`);
        const data = response.data;
        setDeploymentData(data);
        setStatus(data.status);

        if (data.status === 'Completed' || data.status === 'Failed') {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error fetching deployment status:', error);
      }
    };

    fetchStatus(); // Initial fetch
    intervalId = setInterval(fetchStatus, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [deploymentId]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [deploymentData?.logs]);

  const getStatusIcon = () => {
    switch (status) {
      case 'Pending':
        return <Server size={40} />;
      case 'In Progress':
        return <RefreshCw size={40} />;
      case 'Completed':
        return <CheckCircle size={40} />;
      case 'Failed':
        return <XCircle size={40} />;
      default:
        return <Server size={40} />;
    }
  };

  const getStatusClass = () => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="glass-panel">
      <div className="status-header">
        <h1>Deployment Status</h1>
        <p className="subtitle">
          {deploymentData ? `${deploymentData.clientName} - ${deploymentData.domain}` : 'Loading...'}
        </p>
      </div>

      <div className="status-indicator">
        <div className={`status-icon-wrapper ${getStatusClass()}`}>
          {getStatusIcon()}
        </div>
        <div className="status-text">{status}</div>
      </div>

      {deploymentData && deploymentData.logs && deploymentData.logs.length > 0 && (
        <div className="logs-container">
          {deploymentData.logs.map((log, index) => (
            <div key={index} className="log-entry">
              <span className="log-time">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}

      {(status === 'Completed' || status === 'Failed') && (
        <button 
          className="btn" 
          style={{ marginTop: '2rem' }}
          onClick={onNewDeployment}
        >
          New Deployment
        </button>
      )}
    </div>
  );
};

export default LiveStatusDashboard;
