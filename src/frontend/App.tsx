import { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../shared/Task"
import { TasksController } from "../shared/TasksController";

const taskRepo = remult.repo(Task);

function App() {
  const [tasks, setTasks] = useState<Task[]>([
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() =>
    taskRepo.query({

    }).subscribe(setTasks)
    , [])

  const addTask = async () => {
    if (newTaskTitle) {
      setTasks([...tasks,
      await taskRepo.insert({
        title: newTaskTitle,
        completed: false,
        id: tasks.length + 1
      })]);
      setNewTaskTitle('');
    }
  }

  const setAllCompleted = async (completed: boolean) => {
   await TasksController.setAllCompleted(completed);
  }

  return (
    <div>
      <main>
        <input
          value={newTaskTitle}
          onBlur={addTask}
          onKeyDown={e => { if (e.key === "Enter") addTask() }}
          placeholder="What needs to be done?"
          onChange={e => setNewTaskTitle(e.target.value)}
        />
        {tasks
          .map(task => {
            const setTask = (value: typeof task) =>
              setTasks(tasks.map(t => t === task ? value : t));

            const setCompleted = async (completed: boolean) => {
              setTask(await taskRepo.save({ ...task, completed }));
            };
            const setTitle = (title: string) => {
              setTask({ ...task, title });
            };
            const deleteTask = async () => {
              await taskRepo.delete(task)
              setTasks(tasks.filter(t => t !== task));
            };

            const save = async () => {
              try {
                await taskRepo.save(task);
              } catch (error: any) {
                alert(error.message);
              }
            }
            return (
              <div key={task.id}>
                <input type="checkbox"
                  checked={task.completed}
                  onChange={e => setCompleted(e.target.checked)} />
                <input
                  onBlur={save}
                  value={task.title}
                  onChange={e => setTitle(e.target.value)}
                />
                <button onClick={deleteTask}>x</button>
              </div>
            );
          })}
      </main>
      <div>
        <button onClick={() => setAllCompleted(true)}>Set all as completed</button>
        <button onClick={() => setAllCompleted(false)}>Set all as uncompleted</button>
      </div>
    </div>
  );
}
export default App;