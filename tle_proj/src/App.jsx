import React from 'react';
import StudentList from './components/StudentList';
import ThemeToggle from './components/Themetoggle';

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Codeforces Progress Tracker</h1>
      </header>
      <StudentList />
      <ThemeToggle/>
    </div>
  );
};

export default App;
