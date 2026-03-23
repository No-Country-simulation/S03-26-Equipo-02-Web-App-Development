import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, MessageSquare, User } from 'lucide-react';

const Dashboard = () => {
  return (
    <main className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Welcome back, Alex. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">
              <DollarSign size={20} />
            </div>
            <div className="stat-trend up">
              <ArrowUpRight size={16} />
              12.5%
              <span className="stat-trend-text">vs last month</span>
            </div>
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">$124,563</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">
              <Users size={20} />
            </div>
            <div className="stat-trend up">
              <ArrowUpRight size={16} />
              8.2%
            </div>
          </div>
          <div className="stat-title">Active Clients</div>
          <div className="stat-value">1,432</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <div className="stat-icon green">
              <Target size={20} />
            </div>
            <div className="stat-trend down">
              <ArrowDownRight size={16} />
              3.1%
            </div>
          </div>
          <div className="stat-title">Conversion Rate</div>
          <div className="stat-value">64.2%</div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-header">
            <div className="stat-icon orange">
              <TrendingUp size={20} />
            </div>
            <div className="stat-trend up">
              <ArrowUpRight size={16} />
              24%
            </div>
          </div>
          <div className="stat-title">Active Deals</div>
          <div className="stat-value">34</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Deals */}
        <div className="glass-panel section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Deals</h2>
            <button className="view-all">View All</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="client-cell">
                      <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Acme Corp" className="avatar" style={{width: 32, height: 32}} />
                      <div className="client-details">
                        <span className="client-name">Acme Corp Ltd</span>
                        <span className="client-email">contact@acme.inc</span>
                      </div>
                    </div>
                  </td>
                  <td className="amount">$12,400</td>
                  <td><span className="status-badge won">Closed Won</span></td>
                  <td>Sarah Jenkins</td>
                </tr>
                <tr>
                  <td>
                    <div className="client-cell">
                      <div className="client-avatar" style={{background: '#8b5cf6'}}>G</div>
                      <div className="client-details">
                        <span className="client-name">GlobalTech Solutions</span>
                        <span className="client-email">info@globaltech.dev</span>
                      </div>
                    </div>
                  </td>
                  <td className="amount">$45,000</td>
                  <td><span className="status-badge progress">In Progress</span></td>
                  <td>Alex Morgan</td>
                </tr>
                <tr>
                  <td>
                    <div className="client-cell">
                      <div className="client-avatar" style={{background: '#f59e0b'}}>S</div>
                      <div className="client-details">
                        <span className="client-name">Stark Industries</span>
                        <span className="client-email">procurement@stark.com</span>
                      </div>
                    </div>
                  </td>
                  <td className="amount">$128,000</td>
                  <td><span className="status-badge progress">Negotiation</span></td>
                  <td>Michael Chen</td>
                </tr>
                <tr>
                  <td>
                    <div className="client-cell">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Wayne Ent" className="avatar" style={{width: 32, height: 32}} />
                      <div className="client-details">
                        <span className="client-name">Wayne Enterprises</span>
                        <span className="client-email">bruce@wayne.co</span>
                      </div>
                    </div>
                  </td>
                  <td className="amount">$8,500</td>
                  <td><span className="status-badge lost">Closed Lost</span></td>
                  <td>Sarah Jenkins</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-panel section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon" style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)'}}>
                <CheckCircle2 size={20} />
              </div>
              <div className="activity-details">
                <span className="activity-title"><strong>Sarah Jenkins</strong> closed <strong>Acme Corp</strong> deal</span>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon" style={{color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)'}}>
                <MessageSquare size={20} />
              </div>
              <div className="activity-details">
                <span className="activity-title"><strong>Michael Chen</strong> left a note on <strong>Stark Industries</strong></span>
                <span className="activity-time">5 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)'}}>
                <User size={20} />
              </div>
              <div className="activity-details">
                <span className="activity-title">New client <strong>GlobalTech</strong> registered</span>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon" style={{color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)'}}>
                <Clock size={20} />
              </div>
              <div className="activity-details">
                <span className="activity-title">Meeting scheduled with <strong>Wayne Ent</strong></span>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
