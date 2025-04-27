import React from 'react';

const styles = {
  container: {
    maxHeight: '300px',
    overflowY: 'auto',
    borderTop: '1px solid #eee',
    paddingTop: '10px'
  },
  header: {
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    padding: '8px',
    borderBottom: '1px solid #eee',
    fontSize: '12px'
  },
  domain: {
    fontWeight: 'bold'
  },
  category: {
    color: '#7f8c8d'
  },
  duration: {
    color: '#16a085',
    fontWeight: 'bold'
  }
};

const SessionItem = ({ session }) => {
  const date = new Date(Number(session.timestamp));
  const formattedDate = isNaN(date) ? 'Unknown' : date.toLocaleDateString(); 
  const formattedTime = isNaN(date) ? '' : date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  return (
    <li style={styles.listItem}>
      <div style={styles.domain}>{session.domain}</div>
      <div style={styles.category}>{session.category}</div>
      <div style={styles.duration}>{session.duration.toFixed(2)} seconds</div>
      <small>{formattedDate} {formattedTime}</small>
    </li>
  );
};

// Utility: Aggregate sessions by domain
function aggregateSessionsByDomain(sessions) {
  const result = {};
  sessions.forEach(({ domain, category, duration }) => {
    if (!domain) return;
    if (!result[domain]) {
      result[domain] = { domain, category, totalDuration: 0, count: 0 };
    }
    result[domain].totalDuration += duration;
    result[domain].count += 1;
  });
  return Object.values(result);
}

const SessionList = ({ sessions }) => {
  console.log('[SessionList] sessions prop:', sessions);
  const aggregated = aggregateSessionsByDomain(sessions);
  return (
    <div style={styles.container}>
      <div style={styles.header}>Aggregated Usage (by Website):</div>
      <ul style={styles.list}>
        {aggregated.length === 0 ? (
          <li style={styles.listItem}>No usage data available.</li>
        ) : (
          aggregated.map(site => (
            <li key={site.domain} style={styles.listItem}>
              <span style={styles.domain}>{site.domain}</span> (<span style={styles.category}>{site.category}</span>):{' '}
              <span style={styles.duration}>{site.totalDuration.toFixed(2)} seconds</span>, {site.count} visits
            </li>
          ))
        )}
      </ul>
      <div style={styles.header}>Recent Activity:</div>
      <ul style={styles.list}>
        {sessions.length === 0 ? (
          <li style={styles.listItem}>No session data available.</li>
        ) : (
          sessions.map((session, index) => (
            <SessionItem key={index} session={session} />
          ))
        )}
      </ul>
    </div>
  );
};


export default SessionList;