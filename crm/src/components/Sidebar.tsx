import { LayoutDashboard, Users, FolderKanban, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <LayoutDashboard size={20} />
        </div>
        <span className="logo-text">Nexus CRM</span>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Main</div>
        <button className="nav-item active">
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button className="nav-item">
          <Users size={18} />
          Customers
        </button>
        <button className="nav-item">
          <FolderKanban size={18} />
          Projects
        </button>
        <button className="nav-item">
          <BarChart3 size={18} />
          Analytics
        </button>
      </nav>

      <nav className="nav-section">
        <div className="nav-label">Settings</div>
        <button className="nav-item">
          <Settings size={18} />
          Preferences
        </button>
        <button className="nav-item">
          <HelpCircle size={18} />
          Help Center
        </button>
      </nav>

      <div className="user-profile">
        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User Avatar" className="avatar" />
        <div className="user-info">
          <span className="user-name">Alex Morgan</span>
          <span className="user-role">Sales Director</span>
        </div>
        <button className="icon-btn" style={{ marginLeft: 'auto', background: 'transparent', border: 'none' }}>
          <LogOut size={18} className="text-muted" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
