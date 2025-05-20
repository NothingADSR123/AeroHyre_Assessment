import React, { useState, useEffect } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskList from "./components/TaskList";
import FilterDropdown from "./components/FilterDropdown";
import SortButton from "./components/SortButton";
import AddTaskForm from "./components/AddTaskForm";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const { tasks, addTask, deleteTask, setFilter, setSort } = useTasks();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="App" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <header>
        <h1>Task Manager Dashboard</h1>
        <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
      </header>

      <AddTaskForm onAdd={addTask} />
      <div className="actions">
        <FilterDropdown onFilterChange={setFilter} />
        <SortButton onSortToggle={() => setSort((prev) => !prev)} />
      </div>
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
}

export default App;
