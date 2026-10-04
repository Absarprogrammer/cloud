# TaskPulse - Modern To-Do & Task Manager

A clean, responsive, feature-rich To-Do List web application built with pure **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. Designed to be lightweight, easy to understand, and suitable for a **College Mini-Project**.

---

## 🌟 Key Features

1. **Task Management (CRUD)**:
   - **Add Tasks**: Enter task title, optional description/notes, priority level, and due date.
   - **Complete Tasks**: Toggle completion with custom animated checkbox and strikethrough effect.
   - **Edit Tasks**: Update title, priority, due date, or notes via a modern modal dialog.
   - **Delete Tasks**: Remove individual tasks with instant state updates.

2. **Filtering & Searching**:
   - Filter by status: **All**, **Active**, and **Completed**.
   - Live Search: Search tasks by title or description in real-time.

3. **Multi-Criteria Sorting**:
   - Sort by Newest First, Oldest First, Due Date (Earliest), or Priority (High to Low).

4. **Task Priorities & Due Dates**:
   - Visual color-coded priority badges (**High**, **Medium**, **Low**).
   - Dynamic due dates with automatic **Overdue** highlighting for past-due incomplete tasks.

5. **Dashboard & Analytics**:
   - Live metrics: Total Tasks, Active/Pending Count, Completed Count.
   - Completion Rate Progress Bar.

6. **Persistence & Data Management**:
   - **localStorage** Integration: Tasks remain saved even after closing or refreshing the browser.
   - **Clear Completed**: One-click cleanup for all finished tasks.

7. **Modern UI/UX**:
   - **Dark & Light Mode**: Toggle theme with persistent preference.
   - Clean empty-state illustrations and feedback toasts.
   - Mobile-first, fully responsive card-based layout.

---

## 📁 File Structure

```text
lab/
├── index.html   # Main HTML structure with semantic elements & modal dialog
├── style.css    # Modern CSS with CSS custom properties (variables) & flexbox/grid
├── app.js       # Object-Oriented JS (TaskPulseApp class) for state & UI logic
└── README.md    # Project documentation & presentation guide
```

---

## 🚀 How to Run the Project

No backend, server setup, or build tools (`npm`/`node`) are required!

### Option 1: Direct File Opening (Recommended)
1. Navigate to the project folder (`lab/`).
2. Double-click **`index.html`** or right-click and select **Open with Browser** (Google Chrome, Firefox, Microsoft Edge, Safari, etc.).

### Option 2: Live Server / Local Web Server
If using VS Code or any web server:
- Right-click `index.html` and select **Open with Live Server**.
- Or run a simple Python server in the terminal:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

---

## 🎓 College Presentation & Demonstration Guide

If presenting this project for a college lab/viva:

1. **Architecture Highlights**:
   - **Separation of Concerns**: Clean split between structure (`index.html`), presentation (`style.css`), and behavior (`app.js`).
   - **Object-Oriented Design**: Application logic encapsulated inside the `TaskPulseApp` ES6 class.
   - **DOM Manipulation & Event Delegation**: Dynamic element generation without external libraries like React or jQuery.

2. **Data Flow**:
   - User action $\rightarrow$ `TaskPulseApp` method updates state (`this.tasks`) $\rightarrow$ State saved to `localStorage` $\rightarrow$ `render()` updates DOM and stats.

3. **CSS Features**:
   - CSS Custom Properties (`:root` & `[data-theme="dark"]`) for dynamic theme toggling.
   - Flexible responsive layout using CSS Grid and Flexbox.
   - CSS Keyframe animations for modal popups and toast notifications.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`, `<dialog>`).
- **CSS3**: Custom properties, Flexbox, Grid, transitions, keyframe animations, typography.
- **JavaScript (ES6+)**: `class`, `localStorage`, `DOM API`, `addEventListener`, Array methods (`filter`, `sort`, `map`, `reduce`).

---

## 📄 License
This project is open-source and free to use for academic and learning purposes.
