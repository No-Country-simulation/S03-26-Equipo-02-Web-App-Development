import { Search, Bell, MessageSquare, Plus } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} className="text-muted" />
        <input 
          type="text" 
          placeholder="Search for projects, clients, or tasks..." 
          className="search-input"
        />
      </div>

      <div className="topbar-actions">
        <button className="btn-primary">
          <Plus size={18} />
          <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } } as React.CSSProperties}>New Project</span>
        </button>

        <button className="icon-btn">
          <MessageSquare size={18} />
          <span className="badge"></span>
        </button>
        
        <button className="icon-btn">
          <Bell size={18} />
          <span className="badge" style={{ background: '#f59e0b' }}></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
