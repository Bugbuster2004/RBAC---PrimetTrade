import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiClipboard,
  FiShield,
  FiChevronDown, // ✅ added
} from "react-icons/fi";
import { toast } from "sonner";
import api from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title is required");

    setAdding(true);
    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      toast.success("Task created!");
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, status } : task)),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleDeleteAll = async () => {
    toast("Delete ALL tasks?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete All",
        onClick: async () => {
          try {
            await api.delete("/tasks/admin/all");
            toast.success("All tasks deleted");
            fetchTasks();
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Failed to delete all tasks",
            );
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("userRole");
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 500);
    } catch {
      toast.error("Logout failed");
    }
  };

  const statusIcon = (status) => {
    if (status === "completed")
      return <FiCheckCircle className="text-emerald-400" />;
    if (status === "in-progress") return <FiClock className="text-amber-400" />;
    return <FiAlertTriangle className="text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <FiClipboard className="text-white text-base" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Task Manager
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 tracking-widest uppercase">
                  <FiShield className="text-[10px]" /> Admin Mode
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/[0.06] rounded-xl px-4 py-2 transition-all"
          >
            <FiLogOut className="text-sm" />
            Logout
          </button>
        </div>

        {/* Create Task */}
        <div className="bg-[#16181f] border border-white/[0.06] rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <FiPlus className="text-indigo-400" /> New Task
          </h2>
          <form onSubmit={handleCreateTask} className="space-y-3">
            <input
              type="text"
              placeholder="Task title *"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0f1117] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl py-2.5 px-4 text-sm"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0f1117] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl py-2.5 px-4 text-sm"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">
              {adding ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-[#16181f] border border-white/[0.06] rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading...</div>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-start gap-4 px-6 py-4 group"
                >
                  {statusIcon(task.status)}

                  <div className="flex-1">
                    <p className="text-white">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.description}</p>

                    {/* ✅ SELECT WITH ARROW */}
                    <div className="relative inline-block mt-1.5">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleUpdateStatus(task._id, e.target.value)
                        }
                        className={`appearance-none pr-6 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full cursor-pointer outline-none ${
                          task.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : task.status === "in-progress"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        <option value="pending" className="text-black">
                          pending
                        </option>
                        <option value="in-progress" className="text-black">
                          in-progress
                        </option>
                        <option value="completed" className="text-black">
                          completed
                        </option>
                      </select>

                      {/* Arrow icon */}
                      <FiChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none text-slate-400" />
                    </div>
                  </div>

                  <button onClick={() => handleDelete(task._id)}>
                    <FiTrash2 className="text-red-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
