import TaskCard from "./TaskCard";
import "../App.css";

export default function TaskList({ tasks, onDelete }) {
    return (
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} />
        ))}
      </div>
    );
  }
  