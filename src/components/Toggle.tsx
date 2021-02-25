import * as React from 'react';
// import "./Toggle.scss";

interface Props {
  theme: 'light' | 'dark';
  toggleTheme: () => any;
}

const Toggle: React.FC<Props> = ({ theme, toggleTheme }) => {
  return (
    <div style={{ flex: 1 }} className="switch" onClick={toggleTheme}>
      <div className={`toggle ${theme === 'dark' && 'toggle-on'}`}></div>
      <div className="names">
        <p className={`light ${theme === 'dark' && 'light-on'}`}>Light</p>
        <p className={`dark ${theme === 'dark' && 'dark-on'}`}>Dark</p>
      </div>
    </div>
  );
};

export default Toggle;
