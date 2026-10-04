/**
 * TaskPulse - Modern To-Do & Task Manager Application Logic
 * 
 * Features:
 * - LocalStorage state persistence
 * - Complete CRUD operations (Create, Read, Update, Delete)
 * - Filtering (All, Active, Completed) & Live Search
 * - Multi-criteria sorting (Newest, Oldest, Due Date, Priority)
 * - Priority tagging (Low, Medium, High) with visual badges
 * - Due date tracking & overdue highlighting
 * - Theme switcher (Dark / Light mode)
 * - College mini-project modular JavaScript architecture
 */

class TaskPulseApp {
    constructor() {
        // Application State
        this.tasks = [];
        this.currentFilter = 'all'; // 'all' | 'active' | 'completed'
        this.searchQuery = '';
        this.currentSort = 'createdAt-desc';
        this.theme = 'light';

        // DOM Element Cache
        this.initDOMElements();

        // Bind Methods
        this.init = this.init.bind(this);
    }

    /**
     * Cache all required DOM references for optimal performance
     */
    initDOMElements() {
        // Theme
        this.themeToggleBtn = document.getElementById('themeToggleBtn');

        // Stats
        this.statTotalEl = document.getElementById('statTotal');
        this.statActiveEl = document.getElementById('statActive');
        this.statCompletedEl = document.getElementById('statCompleted');
        this.progressTextEl = document.getElementById('progressText');
        this.progressBarFillEl = document.getElementById('progressBarFill');

        // Add Task Form
        this.addTaskForm = document.getElementById('addTaskForm');
        this.taskTitleInput = document.getElementById('taskTitleInput');
        this.taskPriorityInput = document.getElementById('taskPriorityInput');
        this.taskDueDateInput = document.getElementById('taskDueDateInput');
        this.taskDescInput = document.getElementById('taskDescInput');

        // Search & Controls
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.sortSelect = document.getElementById('sortSelect');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');

        // Tab Badges
        this.badgeAll = document.getElementById('badgeAll');
        this.badgeActive = document.getElementById('badgeActive');
        this.badgeCompleted = document.getElementById('badgeCompleted');

        // Task List & Empty State
        this.taskListEl = document.getElementById('taskList');
        this.emptyStateEl = document.getElementById('emptyState');
        this.emptyStateTitle = document.getElementById('emptyStateTitle');
        this.emptyStateSubtitle = document.getElementById('emptyStateSubtitle');

        // Edit Modal
        this.editModal = document.getElementById('editModal');
        this.editTaskForm = document.getElementById('editTaskForm');
        this.editTaskIdInput = document.getElementById('editTaskId');
        this.editTaskTitleInput = document.getElementById('editTaskTitle');
        this.editTaskPriorityInput = document.getElementById('editTaskPriority');
        this.editTaskDueDateInput = document.getElementById('editTaskDueDate');
        this.editTaskDescInput = document.getElementById('editTaskDesc');
        this.closeEditModalBtn = document.getElementById('closeEditModalBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

        // Notifications
        this.toastContainer = document.getElementById('toastContainer');
    }

    /**
     * Initialize application state, load saved data, attach event handlers
     */
    init() {
        this.loadTheme();
        this.loadTasks();
        this.setupEventListeners();
        this.render();
    }

    /* ==========================================================================
       STORAGE & LOCALSTORAGE MANAGERS
       ========================================================================== */

    /**
     * Load tasks from localStorage. If first run, initialize sample tasks.
     */
    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('taskpulse_tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            } else {
                // Initialize default sample tasks for a rich demo experience
                this.tasks = this.getSampleTasks();
                this.saveTasks();
            }
        } catch (error) {
            console.error('Failed to load tasks from localStorage:', error);
            this.tasks = [];
        }
    }

    /**
     * Persist current tasks array to localStorage
     */
    saveTasks() {
        try {
            localStorage.setItem('taskpulse_tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Failed to save tasks to localStorage:', error);
            this.showToast('Failed to save changes to browser storage', 'danger');
        }
    }

    /**
     * Default sample tasks for demonstration
     */
    getSampleTasks() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        return [
            {
                id: 'sample-1',
                title: 'Complete Cloud Computing Lab Assignment',
                description: 'Finalize mini-project documentation and code repository.',
                priority: 'high',
                dueDate: tomorrow.toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 'sample-2',
                title: 'Review System Design Principles',
                description: 'Study microservices vs monolithic architecture tradeoffs.',
                priority: 'medium',
                dueDate: today.toISOString().split('T')[0],
                completed: false,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 'sample-3',
                title: 'Setup Local Development Environment',
                description: 'Installed code editor, browser extensions, and git config.',
                priority: 'low',
                dueDate: yesterday.toISOString().split('T')[0],
                completed: true,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    /* ==========================================================================
       THEME MANAGEMENT (DARK / LIGHT MODE)
       ========================================================================== */

    loadTheme() {
        const savedTheme = localStorage.getItem('taskpulse_theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('taskpulse_theme', theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    }

    /* ==========================================================================
       EVENT LISTENERS
       ========================================================================== */

    setupEventListeners() {
        // Theme Toggle
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

        // Form Submission - Add Task
        this.addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Search Input & Clear
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.trim();
            if (this.searchQuery.length > 0) {
                this.clearSearchBtn.classList.remove('hidden');
            } else {
                this.clearSearchBtn.classList.add('hidden');
            }
            this.render();
        });

        this.clearSearchBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.clearSearchBtn.classList.add('hidden');
            this.searchInput.focus();
            this.render();
        });

        // Filter Tabs
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const selectedFilter = e.currentTarget.getAttribute('data-filter');
                this.setFilter(selectedFilter);
            });
        });

        // Sort Selector
        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Clear Completed Button
        this.clearCompletedBtn.addEventListener('click', () => this.handleClearCompleted());

        // Edit Modal Events
        this.editTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveEdit();
        });

        this.closeEditModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());

        // Close modal when clicking outside dialog window
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeModal();
            }
        });

        // Keyboard Shortcuts (Esc to close modal)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.editModal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    /* ==========================================================================
       TASK OPERATIONS (CRUD)
       ========================================================================== */

    /**
     * Add a new task from the input form
     */
    handleAddTask() {
        const title = this.taskTitleInput.value.trim();
        const priority = this.taskPriorityInput.value;
        const dueDate = this.taskDueDateInput.value;
        const description = this.taskDescInput.value.trim();

        if (!title) return;

        const newTask = {
            id: 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        this.render();

        // Reset Form
        this.addTaskForm.reset();
        this.taskPriorityInput.value = 'medium';
        this.showToast('Task added successfully!');
    }

    /**
     * Toggle completion status of a task
     */
    toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();

            const statusMsg = task.completed ? 'Task marked as completed! 🎉' : 'Task marked as active';
            this.showToast(statusMsg);
        }
    }

    /**
     * Delete a task by ID
     */
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            const deletedTitle = this.tasks[taskIndex].title;
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.render();
            this.showToast(`Deleted "${this.truncateText(deletedTitle, 20)}"`);
        }
    }

    /**
     * Clear all completed tasks
     */
    handleClearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) return;

        if (confirm(`Are you sure you want to clear ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
            this.showToast(`Cleared ${completedCount} completed task(s)`);
        }
    }

    /**
     * Open Edit Modal with pre-filled data
     */
    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.editTaskIdInput.value = task.id;
        this.editTaskTitleInput.value = task.title;
        this.editTaskPriorityInput.value = task.priority || 'medium';
        this.editTaskDueDateInput.value = task.dueDate || '';
        this.editTaskDescInput.value = task.description || '';

        this.editModal.classList.remove('hidden');
        this.editModal.setAttribute('aria-hidden', 'false');
        this.editTaskTitleInput.focus();
    }

    /**
     * Save edited task details
     */
    handleSaveEdit() {
        const id = this.editTaskIdInput.value;
        const title = this.editTaskTitleInput.value.trim();
        const priority = this.editTaskPriorityInput.value;
        const dueDate = this.editTaskDueDateInput.value;
        const description = this.editTaskDescInput.value.trim();

        if (!title) return;

        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.title = title;
            task.priority = priority;
            task.dueDate = dueDate;
            task.description = description;

            this.saveTasks();
            this.render();
            this.closeModal();
            this.showToast('Task updated successfully');
        }
    }

    closeModal() {
        this.editModal.classList.add('hidden');
        this.editModal.setAttribute('aria-hidden', 'true');
        this.editTaskForm.reset();
    }

    /**
     * Set active filter tab (All, Active, Completed)
     */
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterTabs.forEach(tab => {
            const isSelected = tab.getAttribute('data-filter') === filter;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
        this.render();
    }

    /* ==========================================================================
       FILTERING & SORTING COMPUTATIONS
       ========================================================================== */

    getFilteredAndSortedTasks() {
        let filtered = [...this.tasks];

        // 1. Filter by Tab Status
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        // 2. Filter by Search Query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) ||
                (t.description && t.description.toLowerCase().includes(query))
            );
        }

        // 3. Apply Sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'createdAt-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'createdAt-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'dueDate-asc':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority-desc':
                    const priorityWeights = { high: 3, medium: 2, low: 1 };
                    return priorityWeights[b.priority] - priorityWeights[a.priority];
                default:
                    return 0;
            }
        });

        return filtered;
    }

    /* ==========================================================================
       UI RENDERING
       ========================================================================== */

    render() {
        this.renderStats();
        this.renderTaskList();
    }

    /**
     * Render header dashboard metrics and counters
     */
    renderStats() {
        const total = this.tasks.length;
        const active = this.tasks.filter(t => !t.completed).length;
        const completed = this.tasks.filter(t => t.completed).length;
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Animate/Update Stat Numbers
        this.statTotalEl.textContent = total;
        this.statActiveEl.textContent = active;
        this.statCompletedEl.textContent = completed;

        // Update Progress Bar
        this.progressTextEl.textContent = `${progressPercent}%`;
        this.progressBarFillEl.style.width = `${progressPercent}%`;

        // Update Tab Badges
        this.badgeAll.textContent = total;
        this.badgeActive.textContent = active;
        this.badgeCompleted.textContent = completed;

        // Disable "Clear Completed" button if no completed tasks exist
        this.clearCompletedBtn.disabled = completed === 0;
        this.clearCompletedBtn.style.opacity = completed === 0 ? '0.5' : '1';
        this.clearCompletedBtn.style.cursor = completed === 0 ? 'not-allowed' : 'pointer';
    }

    /**
     * Render task items or empty state
     */
    renderTaskList() {
        const tasksToRender = this.getFilteredAndSortedTasks();

        this.taskListEl.innerHTML = '';

        if (tasksToRender.length === 0) {
            this.renderEmptyState();
            this.emptyStateEl.classList.remove('hidden');
        } else {
            this.emptyStateEl.classList.add('hidden');
            tasksToRender.forEach(task => {
                const taskElement = this.createTaskElement(task);
                this.taskListEl.appendChild(taskElement);
            });
        }
    }

    /**
     * Generate HTML DOM element for an individual task card
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        // Calculate Overdue Status
        const isOverdue = this.checkIsOverdue(task.dueDate, task.completed);
        const formattedDate = task.dueDate ? this.formatDate(task.dueDate) : '';

        li.innerHTML = `
            <div class="task-checkbox-container">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle task completion">
            </div>
            
            <div class="task-details">
                <div class="task-header-row">
                    <span class="task-title">${this.escapeHTML(task.title)}</span>
                </div>

                ${task.description ? `<p class="task-desc">${this.escapeHTML(task.description)}</p>` : ''}

                <div class="task-meta-row">
                    <span class="badge badge-priority ${task.priority}">
                        ${this.getPriorityLabel(task.priority)}
                    </span>
                    ${task.dueDate ? `
                        <span class="badge badge-due ${isOverdue ? 'overdue' : ''}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            ${isOverdue ? 'Overdue: ' : 'Due: '}${formattedDate}
                        </span>
                    ` : ''}
                </div>
            </div>

            <div class="task-actions">
                <button class="btn-icon-sm edit-btn" title="Edit Task" aria-label="Edit Task">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon-sm delete-btn" title="Delete Task" aria-label="Delete Task">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;

        // Attach Event Listeners to item controls
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));

        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.openEditModal(task.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    /**
     * Render contextual message for empty states
     */
    renderEmptyState() {
        if (this.searchQuery) {
            this.emptyStateTitle.textContent = 'No matching tasks';
            this.emptyStateSubtitle.textContent = `No tasks found matching "${this.searchQuery}". Try clearing your search.`;
        } else if (this.currentFilter === 'active') {
            this.emptyStateTitle.textContent = 'No active tasks';
            this.emptyStateSubtitle.textContent = 'Great job! You have no pending tasks left to do.';
        } else if (this.currentFilter === 'completed') {
            this.emptyStateTitle.textContent = 'No completed tasks';
            this.emptyStateSubtitle.textContent = 'Completed tasks will appear here once you check them off.';
        } else {
            this.emptyStateTitle.textContent = 'Your task list is empty';
            this.emptyStateSubtitle.textContent = 'Add your first task above to start organizing your day!';
        }
    }

    /* ==========================================================================
       UTILITY & HELPER METHODS
       ========================================================================== */

    checkIsOverdue(dueDateStr, isCompleted) {
        if (!dueDateStr || isCompleted) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(dueDateStr + 'T00:00:00');
        return dueDate < today;
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, options);
    }

    getPriorityLabel(priority) {
        switch (priority) {
            case 'high': return '🔴 High';
            case 'medium': return '🟡 Medium';
            case 'low': return '🟢 Low';
            default: return 'Medium';
        }
    }

    truncateText(str, maxLength) {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    /**
     * Display lightweight floating toast message
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        this.toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 200);
        }, 3000);
    }
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new TaskPulseApp();
    app.init();
});
