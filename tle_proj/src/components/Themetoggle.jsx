import React, { useState } from 'react';

function ThemeToggle() {
  const [override, setOverride] = useState(false);

  const styleId = 'global-override-style';

  const toggleStyle = () => {
    const existing = document.getElementById(styleId);

    if (existing) {
      // Remove the override style
      existing.remove();
    } else {
      // Create and inject global override style
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        * {
          color: white !important;
          background-color: gray !important;
        }
      `;
      document.head.appendChild(style);
    }

    setOverride(!override);
  };

  return (
    
    <button
      onClick={toggleStyle}
      className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-white dark:text-black"
    >
      {override ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}

export default ThemeToggle;
