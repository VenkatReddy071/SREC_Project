import "./Stat.css";

function StatCart({ title, value, progress, color, icon }) {
  const progressBarStyle = {
    width: `${progress}%`,
    backgroundColor: color,
  };

  const iconStyle = {
    backgroundColor: color, // Matches the icon background with the progress bar
  };

  return (
    <div className="stat-card">
      <div className="value">
        <span>{value}</span>
        <span className="icon" style={iconStyle}>
          {icon}
        </span>
      </div>
      <h3>{title}</h3>
      <div className="progress-label">
        <span>0%</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-container">
        <div className="progress-bar" style={progressBarStyle}></div>
      </div>
    
    </div>
  );
}

export default StatCart;
