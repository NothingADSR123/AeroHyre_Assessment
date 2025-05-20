let nextId = 4; // or calculate from mockTasks
import { mockTasks } from "../data/mockTasks";

import { useState, useEffect } from "react";


export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState(false);

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const addTask = (task) => {
    const newTask = { ...task, id: nextId++ };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const priorityWeights = { high: 3, medium: 2, low: 1 };

  const getDaysToDeadline = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    return (dueDate - today) / (1000 * 60 * 60 * 24);
  };

  const filtered = tasks.filter((task) =>
    filter === "All" ? true : task.priority === filter.toLowerCase()
  );

  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const aScore = getDaysToDeadline(a.deadline) / priorityWeights[a.priority];
        const bScore = getDaysToDeadline(b.deadline) / priorityWeights[b.priority];
        return aScore - bScore;
      })
    : filtered;

  return {
    tasks: sorted,
    addTask,
    deleteTask,
    setFilter,
    setSort,
  };
}
