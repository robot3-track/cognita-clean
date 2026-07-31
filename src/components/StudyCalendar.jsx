import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Clock, BookOpen, Trash2 } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EVENT_COLORS = [
  { label: "Violet", bg: "bg-violet-500", border: "border-violet-400", text: "text-violet-300", hex: "#8b5cf6" },
  { label: "Blue", bg: "bg-blue-500", border: "border-blue-400", text: "text-blue-300", hex: "#3b82f6" },
  { label: "Emerald", bg: "bg-emerald-500", border: "border-emerald-400", text: "text-emerald-300", hex: "#10b981" },
  { label: "Amber", bg: "bg-amber-500", border: "border-amber-400", text: "text-amber-300", hex: "#f59e0b" },
  { label: "Rose", bg: "bg-rose-500", border: "border-rose-400", text: "text-rose-300", hex: "#f43f5e" },
  { label: "Cyan", bg: "bg-cyan-500", border: "border-cyan-400", text: "text-cyan-300", hex: "#06b6d4" },
];

const STORAGE_KEY = "cognita_calendar_events";

function loadEvents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function StudyCalendar({ roadmapDays = [], examDate = "" }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState(loadEvents);
  const [selectedDay, setSelectedDay] = useState(null); // { year, month, day }
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newColor, setNewColor] = useState(0);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  // Build roadmap day lookup: date string -> day info
  const roadmapByDate = {};
  if (roadmapDays?.length) {
    const base = new Date();
    roadmapDays.forEach((day, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const k = d.toISOString().slice(0, 10);
      roadmapByDate[k] = day;
    });
  }

  const isToday = (day) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isExamDay = (day) => {
    if (!examDate) return false;
    return dateKey(viewYear, viewMonth, day) === examDate;
  };

  const getKey = (day) => dateKey(viewYear, viewMonth, day);
  const getDayEvents = (day) => events[getKey(day)] || [];
  const getRoadmapDay = (day) => roadmapByDate[getKey(day)];

  const addEvent = () => {
    if (!newTitle.trim() || !selectedDay) return;
    const key = dateKey(selectedDay.year, selectedDay.month, selectedDay.day);
    const event = { id: Date.now(), title: newTitle.trim(), time: newTime, colorIdx: newColor };
    const updated = { ...events, [key]: [...(events[key] || []), event] };
    setEvents(updated);
    saveEvents(updated);
    setNewTitle(""); setNewTime(""); setNewColor(0); setShowAddForm(false);
  };

  const deleteEvent = (day, eventId) => {
    const key = dateKey(selectedDay.year, selectedDay.month, selectedDay.day);
    const updated = { ...events, [key]: (events[key] || []).filter(e => e.id !== eventId) };
    setEvents(updated);
    saveEvents(updated);
  };

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const selectedKey = selectedDay ? dateKey(selectedDay.year, selectedDay.month, selectedDay.day) : null;
  const selectedEvents = selectedKey ? (events[selectedKey] || []) : [];
  const selectedRoadmap = selectedDay ? roadmapByDate[selectedKey] : null;

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="rounded-3xl overflow-hidden" style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--app-border)" }}>
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="font-black text-base">{MONTHS[viewMonth]} {viewYear}</h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center py-2">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-[10px] font-bold uppercase py-1" style={mutedStyle}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-px px-1 pb-2" style={{ background: "var(--app-border)" }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[60px]" style={{ background: "var(--app-surface)" }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = getKey(day);
            const dayEvents = getDayEvents(day);
            const rmDay = getRoadmapDay(day);
            const exam = isExamDay(day);
            const todayFlag = isToday(day);
            const isSelected = selectedDay?.day === day && selectedDay?.month === viewMonth && selectedDay?.year === viewYear;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay({ year: viewYear, month: viewMonth, day })}
                className={`min-h-[60px] p-1.5 cursor-pointer transition-all relative
                  ${isSelected ? "ring-2 ring-violet-500 ring-inset" : "hover:brightness-110"}
                  ${exam ? "bg-rose-500/10" : ""}
                `}
                style={{ background: isSelected ? "rgba(139,92,246,0.1)" : exam ? undefined : "var(--app-surface)" }}
              >
                {/* Day number */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1
                  ${todayFlag ? "bg-violet-500 text-white" : exam ? "bg-rose-500 text-white" : ""}
                `}>
                  {day}
                </div>

                {/* Roadmap indicator */}
                {rmDay && (
                  <div className="w-full h-1 rounded-full bg-blue-500/60 mb-0.5" title={rmDay.theme} />
                )}

                {/* Event dots */}
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: EVENT_COLORS[ev.colorIdx]?.hex || EVENT_COLORS[0].hex }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] font-bold" style={mutedStyle}>+{dayEvents.length - 3}</span>
                  )}
                </div>

                {/* Exam badge */}
                {exam && (
                  <div className="absolute bottom-1 right-1 text-[8px] font-black text-rose-400">EXAM</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-3 text-[10px] font-semibold" style={{ borderTop: "1px solid var(--app-border)", color: "var(--app-text-muted)" }}>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" /> Today</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-1 rounded-full bg-blue-500/60 inline-block" /> Study plan</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Exam day</span>
        </div>
      </div>

      {/* Day Detail Panel */}
      {selectedDay && (
        <div className="rounded-3xl p-5" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-black text-base">
                {MONTHS[selectedDay.month]} {selectedDay.day}, {selectedDay.year}
              </p>
              {selectedRoadmap && (
                <p className="text-xs text-blue-400 font-semibold mt-0.5">
                  📚 Study Plan Day {selectedRoadmap.day}: {selectedRoadmap.theme}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAddForm(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Event
              </button>
              <button onClick={() => setSelectedDay(null)} className="p-2 rounded-xl hover:bg-white/10 transition-all">
                <X className="w-3.5 h-3.5" style={mutedStyle} />
              </button>
            </div>
          </div>

          {/* Roadmap tasks for this day */}
          {selectedRoadmap?.tasks?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 text-blue-400 uppercase tracking-widest">AI Study Tasks</p>
              <div className="space-y-1">
                {selectedRoadmap.tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)" }}>
                    <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span style={{ color: "var(--app-text)" }}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add event form */}
          {showAddForm && (
            <div className="mb-4 p-4 rounded-2xl space-y-3" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={mutedStyle}>New Event</p>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Event title..."
                autoFocus
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                onKeyDown={e => e.key === "Enter" && addEvent()}
              />
              <div className="flex gap-2 items-center">
                <Clock className="w-3.5 h-3.5 shrink-0" style={mutedStyle} />
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                />
              </div>
              <div className="flex gap-1.5">
                {EVENT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setNewColor(i)}
                    className={`w-6 h-6 rounded-full transition-all ${c.bg} ${newColor === i ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowAddForm(false); setNewTitle(""); setNewTime(""); }} className="flex-1 py-2 rounded-xl text-xs font-semibold" style={cardStyle}>Cancel</button>
                <button onClick={addEvent} disabled={!newTitle.trim()} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white disabled:opacity-40 hover:bg-violet-500 transition-all">Add</button>
              </div>
            </div>
          )}

          {/* Events list */}
          {selectedEvents.length === 0 && !selectedRoadmap ? (
            <p className="text-sm text-center py-6" style={mutedStyle}>No events — add one!</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map(ev => {
                const color = EVENT_COLORS[ev.colorIdx] || EVENT_COLORS[0];
                return (
                  <div key={ev.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.bg}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{ev.title}</p>
                      {ev.time && <p className="text-xs" style={mutedStyle}>{ev.time}</p>}
                    </div>
                    <button onClick={() => deleteEvent(selectedDay.day, ev.id)} className="p-1 rounded-lg text-red-400/40 hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}