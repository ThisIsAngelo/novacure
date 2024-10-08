import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  IconChevronDown,
  IconDeviceFloppy,
  IconLoader2,
  IconPlus,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import { useStateContext } from "../context/useStateContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export interface Columns {
  id: string;
  title: string;
}

export interface Tasks {
  id: string;
  columnId: string;
  content: string;
}

type KanbanState = {
  recordId: number;
  columns: Columns[];
  tasks: Tasks[];
};

type KanbanBoardProps = {
  state: KanbanState;
};

type RecordDatas = {
  id?: number;
  userId: number | 0;
  recordName: string;
  analysisResult: string;
  kanbanRecord: string;
  createdBy: string;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ state }) => {
  useEffect(() => {
    setColumns(
      (prevColumns) =>
        state?.columns?.map((col) => ({
          id: col?.id,
          title: col?.title,
        })) || prevColumns
    );

    setTasks(
      (prevTask) =>
        state?.tasks?.map((task) => ({
          id: task?.id,
          columnId: task?.columnId,
          content: task?.content,
        })) || prevTask
    );
  }, [state]);
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Columns[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);

  const columnId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Columns | null>(null);
  const [activeTask, setActiveTask] = useState<Tasks | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );
  const { updateKanbanRecord, records } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [userRecords, setUserRecords] = useState<RecordDatas[]>([]);
  const [selectedRecord, setSelectedRecord] = useState("");

  useEffect(() => {
    setUserRecords(records);
  }, [records]);

  const generateId = () => {
    return Math.floor(Math.random() * 10001).toString();
  };

  const createTask = (columnId: string) => {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, content: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const createColumn = () => {
    const newColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const updateColumn = (id: string, title: string) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        if (activeIndex === -1 || overIndex === -1) return columns;
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          const overIndex = tasks.findIndex((t) => t.id === over.id);
          if (activeIndex === -1 || overIndex === -1) return tasks;
          if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        });
      } else if (isActiveATask) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === active.id);
          if (activeIndex === -1) return tasks;
          tasks[activeIndex].columnId = over.id as string;
          return arrayMove(tasks, activeIndex, activeIndex);
        });
      }
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);
        if (activeIndex === -1 || overIndex === -1) return tasks;
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        if (activeIndex === -1) return tasks;
        tasks[activeIndex].columnId = over.id as string;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const saveChange = () => {
    setLoading(true);
    const kanbanData = { columns: [...columns], tasks: [...tasks] };
    const kanbanDataString = JSON.stringify(kanbanData);
    try {
      updateKanbanRecord({
        recordId: state.recordId,
        kanbanRecord: kanbanDataString,
      });
      toast.success("Save Change Successfully");
    } catch (error) {
      console.log("Error Saving Change:", error);
    } finally {
      setLoading(false);
    }
  };

  const kanbanChange = (name: string) => {
    const filteredRecord = userRecords.find((rec) => rec.recordName === name);
    const recordId = filteredRecord?.id;
    const kanbanRecord = filteredRecord?.kanbanRecord;
    const parsedKanbanRecord = kanbanRecord ? JSON.parse(kanbanRecord) : null;
    navigate(`/screening-schedules`, {
      state: { recordId, ...parsedKanbanRecord },
    });
    setSelectedRecord(name);
    setIsDropDownOpen(false);
  };

  return (
    <div className="w-full mt-1 text-white">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="mb-4 w-full flex flex-col xs:flex-row items-start gap-2">
          <div className="flex relative">
            <div className=" bg-slate-900 z-50">
              <button
                onClick={() => setIsDropDownOpen((prev) => !prev)}
                className="flex justify-between items-center gap-2 bg-slate-800 p-4 min-w-56 rounded-2xl border border-slate-700 hover:border-sky-500 focus:outline-none transition ease-linear duration-150"
              >
                {selectedRecord ? selectedRecord : "Select Record"}
                <IconChevronDown
                  className={`w-6 h-6 ${
                    isDropDownOpen && "rotate-180"
                  } transition ease-linear duration-200`}
                />
              </button>
            </div>
            <ul
              className={`${
                isDropDownOpen ? "translate-y-full" : "translate-y-0 scale-0"
              } absolute -bottom-2 flex flex-col gap-2 mt-2 p-3 w-full max-h-[300px] bg-slate-800 border border-sky-500 rounded-2xl transition ease-in duration-200 z-20 overflow-y-scroll`}
            >
              {userRecords.length == 0 && (
                <p className="font-extralight text-center">Record not found</p>
              )}
              {userRecords.map((record) => (
                <li key={record.recordName}>
                  <button
                    onClick={() => kanbanChange(record.recordName)}
                    disabled={
                      !record.kanbanRecord || record.id === state?.recordId
                    }
                    className={`w-full text-start rounded-lg hover:bg-slate-700 p-2 cursor-pointer transition ease-linear duration-100 ${
                      !record.kanbanRecord &&
                      "text-slate-600 cursor-default hover:bg-slate-800"
                    }
                      ${
                        record.id === state?.recordId &&
                        "bg-slate-700 cursor-default"
                      }`}
                  >
                    {record.recordName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {!state ? null : (
            <button
              onClick={saveChange}
              className="flex items-center gap-2 p-4 bg-slate-800 min-w-56 border border-slate-700 hover:border-sky-500 transition ease-linear duration-150 rounded-2xl"
            >
              <IconDeviceFloppy className="w-6 h-6" />
              Save Change
              {loading && <IconLoader2 className="w-6 h-6 animate-spin" />}
            </button>
          )}
        </div>

        {state && columns && (
          <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-0 w-full overflow-scroll">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:flex gap-2 lg:gap-0">
              <SortableContext items={columnId}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                  />
                ))}
              </SortableContext>
            </div>
            <button
              onClick={() => createColumn()}
              className="flex items-center h-[60px] w-full xs:w-1/2 lg:w-[350px] lg:min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-slate-500 hover:border-sky-500 bg-slate-800 p-4 focus:outline-none"
            >
              <IconPlus />
              Add Column
            </button>
          </div>
        )}

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
