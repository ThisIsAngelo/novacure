import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Tasks } from "./KanbanBoard";

type TaskCardProps = {
  task: Tasks;
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  deleteTask,
  updateTask,
}) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl p-2.5 text-left bg-slate-900 hover:ring-2 hover:ring-inset hover:ring-sky-500"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl p-2.5 text-left bg-slate-900 hover:ring-2 hover:ring-inset hover:ring-sky-500"
      >
        <textarea
          className="h-[90%] w-full resize-none rounded border-none bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task Content Here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="task relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-slate-900 p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-sky-500"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-[50%] hover:bg-slate-500 stroke-white p-2 opacity-60 hover:opacity-100 transition ease-linear duration-150"
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
