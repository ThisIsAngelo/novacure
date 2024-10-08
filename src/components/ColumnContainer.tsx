import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Columns, Tasks } from "./KanbanBoard";
import TaskCard from "./TaskCard";

type ColumnContainerProps = {
  column: Columns;
  deleteColumn: (columnId: string) => void;
  updateColumn: (id: string, title: string) => void;
  tasks: Tasks[];
  createTask: (columnId: string) => void;
  updateTask: (id: string, content: string) => void;
  deleteTask: (id: string) => void;
};

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) => {
  const [editMode, setEditMode] = useState(false);

  const tasksId = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-slate-800 p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-green-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] max-h-[500px] w-full lg:w-[350px] flex-col rounded-xl bg-slate-800 mr-4"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="text-md m-2 flex h-[60px] cursor-grab items-center justify-between rounded-xl bg-slate-900 p-3 font-bold"
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              type="text"
              className="rounded border bg-slate-900 px-2 outline-none focus:border-sky-500"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="rounded-[50%] text-slate-300 p-2 hover:bg-slate-800 hover:text-white transition ease-linear duration-100"
        >
          <IconTrash />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        className="flex justify-center items-center gap-2 rounded-md border-t-2 border-slate-500 p-4 hover:bg-slate-700 hover:text-sky-500 transition ease-linear duration-150"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <IconPlus />
        Add task
      </button>
    </div>
  );
};

export default ColumnContainer;
