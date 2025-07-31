import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import RegistrationForm from './components/RegistrationForm';
import StatsSection from './components/StatsSection';
import { User, BarChart3 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('registration');

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveTab('registration')}
        >
          <User size={16} style={{ marginRight: '8px' }} />
          Registration Form
        </button>
        <button 
          className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={16} style={{ marginRight: '8px' }} />
          Statistics
        </button>
      </div>

      {activeTab === 'registration' ? (
        <RegistrationForm />
      ) : (
        <StatsSection />
      )}
    </div>
  );
}

export default App; 