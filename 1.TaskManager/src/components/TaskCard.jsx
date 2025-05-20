import "../App.css"; // Import your CSS file for styling
export default function TaskCard({ task, onDelete }) {
    const isOverdue = new Date(task.deadline) < new Date();
  
    return (
      <div className={`task-card ${isOverdue ? "overdue" : ""}`}>
        <h3>{task.title}</h3>
        <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
        <p>Priority: {task.priority}</p>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    );
  }
  