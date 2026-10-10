import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Login Component ---
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if ((email === 'admin' || email === 'admin@example.com') && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={styles.fullscreenLoginWrapper}>
      <style>{`
        body { padding: 0 !important; margin: 0 !important; display: block !important; overflow: hidden; }
        #root { display: block !important; width: 100% !important; height: 100vh; }
      `}</style>
      
      <div style={styles.loginOverlay}>
        
        {/* Left Marketing Content */}
        <div style={styles.marketingContainer}>
          
          <div style={styles.kotakLogoBox}>
            <div style={styles.logoCircle}>
              <img src="/kotak-logo.png" alt="Kotak Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#003366', letterSpacing: '-0.5px', lineHeight: '1.2', whiteSpace: 'nowrap' }}>Kotak Mahindra Bank</span>
              <span style={{ fontSize: '0.9rem', color: '#ED1C24', fontWeight: '700', lineHeight: '1' }}>Partner Admin Portal</span>
            </div>
          </div>

          <h1 style={styles.mainHeading}>
            Account Opening <br/>
            for <span style={{ color: '#ED1C24' }}>Delivery Executives</span>
          </h1>
          <p style={styles.tagline}>Earn More. Secure Your Future.</p>
          
          <div style={styles.benefitsVertical}>
            <div style={styles.benefitItem}>
              <div style={styles.benefitIcon}>👤+</div>
              <span style={styles.benefitText}>Easy Account<br/>Opening Process</span>
            </div>
            <div style={styles.benefitItem}>
              <div style={styles.benefitIcon}>📄</div>
              <span style={styles.benefitText}>Quick Verification</span>
            </div>
            <div style={styles.benefitItem}>
              <div style={styles.benefitIcon}>💳</div>
              <span style={styles.benefitText}>Digital Savings<br/>Account</span>
            </div>
            <div style={styles.benefitItem}>
              <div style={styles.benefitIcon}>🛡️</div>
              <span style={styles.benefitText}>Secure & Reliable<br/>Banking</span>
            </div>
          </div>

          {/* Bottom Strip */}
          <div style={styles.bottomStrip}>
            <div style={styles.stripItem}>
              <div style={{...styles.stripIcon, background: '#ffedd5'}}>🏦</div>
              <span style={styles.stripText}>Zero Balance<br/>Account</span>
            </div>
            <div style={styles.stripItem}>
              <div style={{...styles.stripIcon, color: '#3b82f6', background: '#dbeafe', fontSize: '1.2rem'}}>₹</div>
              <span style={styles.stripText}>Instant<br/>Activation</span>
            </div>
            <div style={styles.stripItem}>
              <div style={{...styles.stripIcon, background: '#d1fae5'}}>📱</div>
              <span style={styles.stripText}>Mobile<br/>Banking</span>
            </div>
            <div style={styles.stripItem}>
              <div style={{...styles.stripIcon, background: '#fef3c7'}}>🎁</div>
              <span style={styles.stripText}>Exclusive<br/>Benefits</span>
            </div>
          </div>

        </div>

        {/* Right Login Form */}
        <div style={styles.loginCardContainer}>
          <div style={styles.glassLoginCard}>
            <div style={styles.loginHeader}>
              <h2 style={styles.loginTitle}>Delivery Executive Login</h2>
              <p style={styles.loginSubtitle}>Login to start the account opening process and manage your applications.</p>
            </div>
            
            <form onSubmit={handleLogin} style={styles.loginForm}>
              {error && <div style={styles.loginError}>{error}</div>}
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <input 
                    type="email" 
                    style={styles.input} 
                    placeholder="Enter email address"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    style={styles.input} 
                    placeholder="Enter password"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>                            
              <button type="submit" style={styles.loginBtn}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('All');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFilter, setDateFilter] = useState('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  // Document Modal State
  const [viewDocs, setViewDocs] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:5000/api/riders')
      .then((res) => res.json())
      .then((data) => {
        setRiders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- Derived Data for Metrics ---
  const isDateInRange = (dateString) => {
    if (dateFilter === 'All') return true;
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    if (dateFilter === 'Today') {
      return date >= today;
    }
    if (dateFilter === 'Yesterday') {
      return date >= yesterday && date < today;
    }
    if (dateFilter === 'DayBefore') {
      return date >= dayBefore && date < yesterday;
    }
    if (dateFilter === 'Custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    return true; 
  };

  const filteredRiders = riders.filter(r => {
    const matchesSearch = r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mobile?.includes(searchTerm);
    const matchesCompany = filterCompany === 'All' || r.company === filterCompany;
    const matchesDate = isDateInRange(r.created_at);
    return matchesSearch && matchesCompany && matchesDate;
  }).sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'weekly_earnings') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else if (sortField === 'created_at') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    } else {
      valA = (valA || '').toLowerCase();
      valB = (valB || '').toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalRiders = riders.length;
  const uniqueCompanies = [...new Set(riders.map(r => r.company))].length;
  const totalEarnings = riders.reduce((acc, r) => acc + (r.weekly_earnings || 0), 0);
  const avgEarnings = totalRiders > 0 ? Math.round(totalEarnings / totalRiders) : 0;
  const twoWheelers = riders.filter(r => ['bike', 'scooter'].includes(r.vehicle_type?.toLowerCase())).length;

  const companiesList = ['All', ...new Set(riders.map(r => r.company))].filter(Boolean);

  // --- Chart Data Processing ---
  const companyCounts = riders.reduce((acc, r) => {
    if (r.company) acc[r.company] = (acc[r.company] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(companyCounts).map(key => ({ name: key, value: companyCounts[key] }));
  const PIE_COLORS = ['#0F172A', '#ED1C24', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'];

  const earningsByCompany = riders.reduce((acc, r) => {
    if (r.company && r.weekly_earnings) {
      if (!acc[r.company]) acc[r.company] = { total: 0, count: 0 };
      acc[r.company].total += r.weekly_earnings;
      acc[r.company].count += 1;
    }
    return acc;
  }, {});
  const barData = Object.keys(earningsByCompany).map(key => ({
    name: key,
    'Avg Earnings': Math.round(earningsByCompany[key].total / earningsByCompany[key].count)
  }));
  // --- Export Functions ---
  const exportToExcel = () => {
    // Format data for export (exclude file paths)
    const exportData = filteredRiders.map(r => ({
      ID: r.id,
      Name: r.full_name,
      Mobile: r.mobile,
      Email: r.email || 'N/A',
      Company: r.company,
      Category: r.work_category,
      Employment: r.employment_type || 'N/A',
      RiderID: r.rider_id,
      Earnings: r.weekly_earnings,
      Vehicle: r.vehicle_type,
      Date: new Date(r.created_at).toLocaleDateString()
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riders");
    XLSX.writeFile(wb, "Rider_Data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text('Rider Earnings Survey Data', 14, 22);

    const tableColumn = ["ID", "Name", "Mobile", "Company", "Earnings", "Vehicle", "Date"];
    const tableRows = filteredRiders.map(r => [
      r.id, r.full_name, r.mobile, r.company, r.weekly_earnings, r.vehicle_type, new Date(r.created_at).toLocaleDateString()
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 30 });
    doc.save('Rider_Data.pdf');
  };

  return (
    <div style={styles.dashboardContainer}>
      <style>{`
        body { padding: 0 !important; margin: 0 !important; display: block !important; overflow: hidden; background-color: #F8FAFC; }
        #root { display: block !important; width: 100% !important; height: 100vh; }
      `}</style>
      
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <img src="/kotak-logo.png" alt="Kotak Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
             <h2 style={{ fontSize: '0.95rem', margin: 0, fontWeight: '900', color: '#003366', letterSpacing: '-0.5px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Kotak Mahindra Bank</h2>
             <span style={{ fontSize: '0.7rem', color: '#ED1C24', fontWeight: '700', whiteSpace: 'nowrap' }}>Partner Admin Portal</span>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <a href="#" style={styles.navItemActive}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Riders Data
          </a>
        </nav>
        
        <div style={styles.sidebarBottom}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Riders Overview</h1>
            <p style={{margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '0.95rem'}}>Manage and track delivery partner accounts.</p>
          </div>
          <div style={styles.exportGroup}>
            <button onClick={exportToExcel} style={styles.btnExcel}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Excel
            </button>
            <button onClick={exportToPDF} style={styles.btnPdf}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Export PDF
            </button>
          </div>
        </header>

        {/* Metrics Cards */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={{...styles.metricIconBox, background: '#EFF6FF', color: '#2563EB'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div>
              <p style={styles.metricLabel}>Total Riders</p>
              <h3 style={styles.metricValue}>{totalRiders}</h3>
            </div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{...styles.metricIconBox, background: '#FEF2F2', color: '#ED1C24'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <p style={styles.metricLabel}>Avg. Weekly Earnings</p>
              <h3 style={styles.metricValue}>₹{avgEarnings.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{...styles.metricIconBox, background: '#F5F3FF', color: '#7C3AED'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
            </div>
            <div>
              <p style={styles.metricLabel}>Unique Companies</p>
              <h3 style={styles.metricValue}>{uniqueCompanies}</h3>
            </div>
          </div>
          
          <div style={styles.metricCard}>
            <div style={{...styles.metricIconBox, background: '#ECFCCB', color: '#65A30D'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6a3.5 3.5 0 1 0-7 0"></path><path d="M12 17.5V14l-3-3 4-3 2 3h2"></path></svg>
            </div>
            <div>
              <p style={styles.metricLabel}>Two Wheelers</p>
              <h3 style={styles.metricValue}>{twoWheelers}</h3>
            </div>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search riders by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.selectGroup}>
            <div style={styles.selectWrapper}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ ...styles.selectInput, minWidth: '150px' }}
              >
                <option value="All">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="DayBefore">Day Before</option>
                <option value="Custom">Custom Date</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', right: '12px', pointerEvents: 'none'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            {dateFilter === 'Custom' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="date" 
                  value={customStartDate} 
                  onChange={(e) => setCustomStartDate(e.target.value)} 
                  style={{ ...styles.searchInput, padding: '0.75rem', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '10px' }} 
                />
                <input 
                  type="date" 
                  value={customEndDate} 
                  onChange={(e) => setCustomEndDate(e.target.value)} 
                  style={{ ...styles.searchInput, padding: '0.75rem', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '10px' }} 
                />
              </div>
            )}
            <div style={styles.selectWrapper}>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                style={styles.selectInput}
              >
                {companiesList.map(c => <option key={c} value={c}>{c === 'All' ? 'All Companies' : c}</option>)}
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', right: '12px', pointerEvents: 'none'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <div style={styles.selectWrapper}>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                style={styles.selectInput}
              >
                <option value="created_at">Sort by Date</option>
                <option value="weekly_earnings">Sort by Earnings</option>
                <option value="full_name">Sort by Name</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', right: '12px', pointerEvents: 'none'}}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              style={styles.sortBtn}
              title={`Sorting in ${sortOrder === 'asc' ? 'Ascending' : 'Descending'} order`}
            >
              {sortOrder === 'asc' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
              )}
            </button>
          </div>
        </div>

        {/* Analytics Charts */}
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Average Earnings by Company</h3>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="Avg Earnings" fill="#0F172A" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Riders Distribution</h3>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748B', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>



        {/* Data Table */}
        <div style={styles.tableContainer}>
          {loading ? (
            <div style={styles.emptyState}>
              <div style={styles.spinner}></div>
              <p>Loading records...</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Rider Profile</th>
                  <th style={styles.th}>Company / Role</th>
                  <th style={styles.th}>Earnings</th>
                  <th style={styles.th}>Documents</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.map((rider) => (
                  <tr key={rider.id} style={styles.tableRow}>
                    <td style={styles.tdId}>#{String(rider.id).padStart(4, '0')}</td>
                    <td style={styles.td}>
                      <div style={styles.profileBox}>
                        <div style={styles.avatar}>{rider.full_name?.substring(0, 1).toUpperCase() || 'R'}</div>
                        <div>
                          <div style={styles.profileName}>{rider.full_name}</div>
                          <div style={styles.profileMeta}>{rider.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.companyName}>{rider.company}</div>
                      <div style={styles.badge}>{rider.work_category}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.earnings}>₹{Number(rider.weekly_earnings || 0).toLocaleString('en-IN')}</div>
                    </td>
                    <td style={styles.td}>
                      {(!rider.aadhar_file && !rider.pan_file) ? (
                        <span style={styles.noDoc}>Pending Docs</span>
                      ) : (
                        <button onClick={() => setViewDocs(rider)} style={styles.viewDocBtn}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          View Docs
                        </button>
                      )}
                    </td>
                    <td style={styles.tdDate}>{new Date(rider.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredRiders.length === 0 && (
            <div style={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '1rem'}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              <p>No records found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Document Modal */}
      {viewDocs && (
        <div style={styles.modalOverlay} onClick={() => setViewDocs(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Documents Verification</h2>
                <p style={styles.modalSub}>For {viewDocs.full_name} ({viewDocs.mobile})</p>
              </div>
              <button onClick={() => setViewDocs(null)} style={styles.modalClose}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div style={styles.docsGrid}>
              <div style={styles.docCard}>
                <h3 style={styles.docTitle}>Aadhar Card</h3>
                {viewDocs.aadhar_file ? (
                  viewDocs.aadhar_file.toLowerCase().endsWith('.pdf') ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <object data={`http://localhost:5000${viewDocs.aadhar_file}`} type="application/pdf" width="100%" height="300px" style={{borderRadius: '8px', border: '1px solid #cbd5e1'}}>
                        <p>PDF preview not available. <a href={`http://localhost:5000${viewDocs.aadhar_file}`} target="_blank" rel="noreferrer">Download PDF</a></p>
                      </object>
                      <a href={`http://localhost:5000${viewDocs.aadhar_file}`} target="_blank" rel="noreferrer" style={{color: '#2563eb', fontWeight: '600', fontSize: '0.9rem'}}>Open PDF in New Tab</a>
                    </div>
                  ) : (
                    <a href={`http://localhost:5000${viewDocs.aadhar_file}`} target="_blank" rel="noreferrer" style={styles.imgLink}>
                      <img 
                        src={`http://localhost:5000${viewDocs.aadhar_file}`} 
                        alt="Aadhar" 
                        style={styles.docImg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=File+Missing+(Local+Dev)'; }}
                      />
                      <div style={styles.imgOverlay}>Click to expand</div>
                    </a>
                  )
                ) : <div style={styles.noDocPlaceholder}>Not uploaded by user</div>}
              </div>
              
              <div style={styles.docCard}>
                <h3 style={styles.docTitle}>PAN Card</h3>
                {viewDocs.pan_file ? (
                  viewDocs.pan_file.toLowerCase().endsWith('.pdf') ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <object data={`http://localhost:5000${viewDocs.pan_file}`} type="application/pdf" width="100%" height="300px" style={{borderRadius: '8px', border: '1px solid #cbd5e1'}}>
                        <p>PDF preview not available. <a href={`http://localhost:5000${viewDocs.pan_file}`} target="_blank" rel="noreferrer">Download PDF</a></p>
                      </object>
                      <a href={`http://localhost:5000${viewDocs.pan_file}`} target="_blank" rel="noreferrer" style={{color: '#2563eb', fontWeight: '600', fontSize: '0.9rem'}}>Open PDF in New Tab</a>
                    </div>
                  ) : (
                    <a href={`http://localhost:5000${viewDocs.pan_file}`} target="_blank" rel="noreferrer" style={styles.imgLink}>
                      <img 
                        src={`http://localhost:5000${viewDocs.pan_file}`} 
                        alt="PAN" 
                        style={styles.docImg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=File+Missing+(Local+Dev)'; }}
                      />
                      <div style={styles.imgOverlay}>Click to expand</div>
                    </a>
                  )
                ) : <div style={styles.noDocPlaceholder}>Not uploaded by user</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Ultra Premium Dashboard UI Styles ---
const styles = {
  // --- Fullscreen Login Styles ---
  fullscreenLoginWrapper: { 
    display: 'flex', 
    height: '100vh', 
    width: '100vw', 
    fontFamily: "'Inter', sans-serif", 
    overflow: 'hidden',
    backgroundImage: 'url(/bg-image.jpg)',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  loginOverlay: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 4rem', background: 'transparent', boxSizing: 'border-box' },
  marketingContainer: { flex: 1, maxWidth: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingRight: '2rem' },
  kotakLogoBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
  logoCircle: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  kotakRedText: { color: '#ED1C24', fontSize: '1.4rem', fontWeight: '900', lineHeight: 1, letterSpacing: '-0.5px' },
  kotakSubText: { color: '#003366', fontSize: '0.7rem', fontWeight: '600', lineHeight: 1 },
  mainHeading: { fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '0.5rem', color: '#14294B' },
  tagline: { fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#14294B' },
  benefitsVertical: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' },
  benefitItem: { display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFF', padding: '0.5rem 1rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '280px' },
  benefitIcon: { fontSize: '1.25rem', color: '#ED1C24', fontWeight: 'bold' },
  benefitText: { fontSize: '0.85rem', fontWeight: '700', color: '#14294B', lineHeight: 1.2 },
  bottomStrip: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', marginTop: 'auto', maxWidth: '420px' },
  stripItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.4rem' },
  stripIcon: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' },
  stripText: { fontSize: '0.65rem', fontWeight: '700', color: '#14294B', lineHeight: 1.2 },
  loginCardContainer: { flex: 1, display: 'flex', justifyContent: 'flex-end', maxWidth: '500px' },
  glassLoginCard: { background: 'rgba(255, 255, 255, 0.98)', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '460px' },
  loginHeader: { marginBottom: '2rem' },
  loginTitle: { margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#14294B', fontWeight: '800' },
  loginSubtitle: { margin: 0, color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 },
  loginForm: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  loginError: { background: '#FEF2F2', color: '#ED1C24', border: '1px solid #FECACA', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', textAlign: 'center' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.9rem', fontWeight: '700', color: '#14294B' },
  inputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid #D9E0EA', borderRadius: '10px', transition: 'border-color 0.2s', background: '#FFF' },
  prefixSpan: { padding: '0.875rem 0 0.875rem 1rem', color: '#14294B', fontWeight: '600', borderRight: '1px solid #D9E0EA', marginRight: '0.5rem' },
  input: { padding: '0.875rem', border: 'none', background: 'transparent', width: '100%', fontSize: '1rem', outline: 'none', color: '#14294B' },
  eyeBtn: { background: 'none', border: 'none', padding: '0 1rem', cursor: 'pointer', fontSize: '1.2rem' },
  formOptions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' },
  rememberMe: { display: 'flex', alignItems: 'center', color: '#64748b', cursor: 'pointer' },
  forgotPassword: { color: '#ED1C24', textDecoration: 'none', fontWeight: '600' },
  loginBtn: { padding: '1rem', background: '#ED1C24', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem', transition: 'background 0.2s' },
  divider: { display: 'flex', alignItems: 'center', margin: '1rem 0', color: '#64748b' },
  dividerLine: { flex: 1, height: '1px', background: '#D9E0EA' },
  dividerText: { padding: '0 1rem', fontSize: '0.85rem', fontWeight: '600' },
  otpBtn: { padding: '1rem', background: 'transparent', color: '#14294B', border: '2px solid #14294B', borderRadius: '10px', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' },
  loginFooter: { textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' },
  registerLink: { color: '#ED1C24', textDecoration: 'none', fontWeight: '700', marginLeft: '0.25rem' },

  // Dashboard Layout 
  dashboardContainer: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F8FAFC', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' },
  
  // Sidebar Ultra Modern
  sidebar: { width: '280px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' },
  sidebarLogo: { padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  nav: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  navItemActive: { padding: '0.875rem 1rem', backgroundColor: '#FEE2E2', color: '#ED1C24', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' },
  navItem: { padding: '0.875rem 1rem', color: '#64748B', borderRadius: '10px', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', transition: 'all 0.2s' },
  sidebarBottom: { padding: '1.5rem', borderTop: '1px solid #F1F5F9' },
  logoutBtn: { width: '100%', padding: '0.875rem', background: 'transparent', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', fontSize: '0.95rem' },

  // Main Content Modern
  main: { flex: 1, padding: '2.5rem 3.5rem', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' },
  headerTitle: { margin: 0, fontSize: '2rem', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.5px' },
  exportGroup: { display: 'flex', gap: '1rem' },
  btnExcel: { padding: '0.6rem 1.25rem', backgroundColor: '#0F172A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)' },
  btnPdf: { padding: '0.6rem 1.25rem', backgroundColor: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },

  // Metrics Minimal
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' },
  metricCard: { background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '1.25rem', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' },
  metricIconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  metricLabel: { margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.85rem', fontWeight: '600' },
  metricValue: { margin: 0, color: '#0F172A', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.5px' },

  // Filters Modern
  filterBar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', width: '100%' },
  selectGroup: { display: 'flex', gap: '1rem', alignItems: 'center' },
  sortBtn: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F172A', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)', transition: 'background 0.2s' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  chartCard: { background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' },
  chartTitle: { margin: '0 0 1.5rem 0', color: '#0F172A', fontSize: '1.1rem', fontWeight: '800' },
  chartWrapper: { width: '100%', height: '300px' },
  searchBox: { display: 'flex', alignItems: 'center', background: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '10px', flex: 1, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0F172A' },
  selectWrapper: { background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)', display: 'flex', alignItems: 'center', position: 'relative' },
  selectInput: { padding: '0.75rem 2.5rem 0.75rem 1.25rem', border: 'none', background: 'transparent', fontSize: '0.95rem', minWidth: '180px', outline: 'none', color: '#0F172A', fontWeight: '600', appearance: 'none', cursor: 'pointer' },

  // Table Clean & Spaced
  tableContainer: { background: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { borderBottom: '1px solid #E2E8F0' },
  th: { padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.05em' },
  tableRow: { borderBottom: '1px solid #F8FAFC', transition: 'background 0.2s' },
  td: { padding: '1rem 1.5rem', verticalAlign: 'middle' },
  tdId: { padding: '1rem 1.5rem', verticalAlign: 'middle', color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' },
  tdDate: { padding: '1rem 1.5rem', verticalAlign: 'middle', color: '#64748B', fontSize: '0.9rem' },
  
  profileBox: { display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9', color: '#334155', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem' },
  profileName: { fontWeight: '700', color: '#0F172A', fontSize: '0.95rem' },
  profileMeta: { fontSize: '0.85rem', color: '#64748B', marginTop: '0.1rem' },
  
  companyName: { fontWeight: '600', color: '#334155', fontSize: '0.9rem' },
  badge: { display: 'inline-block', padding: '0.2rem 0.6rem', background: '#F1F5F9', color: '#475569', borderRadius: '100px', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '600' },
  earnings: { fontWeight: '800', color: '#16A34A', fontSize: '1rem' },
  noDoc: { display: 'inline-block', color: '#94A3B8', fontSize: '0.8rem', fontWeight: '600', padding: '0.4rem 0.75rem', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1' },
  viewDocBtn: { padding: '0.5rem 0.85rem', background: '#FFFFFF', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)' },
  
  emptyState: { padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94A3B8', fontSize: '1rem', fontWeight: '500' },
  spinner: { width: '40px', height: '40px', border: '3px solid #F1F5F9', borderTopColor: '#0F172A', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' },

  // Modals Minimal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', width: '90%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  modalTitle: { margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: '#0F172A', fontWeight: '800' },
  modalSub: { margin: 0, color: '#64748B', fontSize: '1rem', fontWeight: '500' },
  modalClose: { background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' },
  docsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
  docCard: { background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1rem' },
  docTitle: { margin: 0, fontSize: '1.1rem', color: '#0F172A', fontWeight: '700' },
  imgLink: { display: 'block', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'zoom-in' },
  docImg: { display: 'block', width: '100%', maxHeight: '350px', objectFit: 'contain', background: '#F8FAFC' },
  imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#FFF', padding: '1rem', fontSize: '0.85rem', fontWeight: '600', opacity: 0, transition: 'opacity 0.2s', textAlign: 'center' },
  noDocPlaceholder: { padding: '4rem 1rem', background: '#F8FAFC', borderRadius: '12px', color: '#94A3B8', fontWeight: '500', textAlign: 'center', border: '1px dashed #CBD5E1' }
};
