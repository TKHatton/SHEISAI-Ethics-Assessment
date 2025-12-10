
import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Principles } from './pages/Principles';
import { Frameworks } from './pages/Frameworks';
import { Global } from './pages/Global';
import { Resources } from './pages/Resources';
import { ChatAssistant } from './pages/ChatAssistant';
import { Team } from './pages/Team';
import { Registration } from './pages/Registration';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={setCurrentPage} />;
      case Page.PRINCIPLES:
        return <Principles />;
      case Page.FRAMEWORKS:
        return <Frameworks />;
      case Page.GLOBAL:
        return <Global />;
      case Page.TEAM:
        return <Team />;
      case Page.RESOURCES:
        return <Resources />;
      case Page.CHAT:
        return <ChatAssistant />;
      case Page.REGISTER:
        return <Registration />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
