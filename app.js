document.addEventListener('DOMContentLoaded', () => {
    
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const todosContainer = document.querySelector('.todos-container');

    const emptyImage = document.querySelector('.empty-image');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    let confettiLaunched = false; // ✅ prevents multiple triggers

    const toggleEmptyState = () => {
        if (emptyImage) {
            emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        }
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            if (!confettiLaunched) {
                launchConfetti(); // ✅ use renamed function
                confettiLaunched = true;
            }
        } else {
            confettiLaunched = false; // reset if not all completed
        }
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) =>
            addTask(text, completed, false)
        );
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
             <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
             <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div> `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();

});

// ✅ renamed function so it won’t overwrite tsparticles.confetti
const launchConfetti = () => {
    var defaults = {
        scalar: 2,
        spread: 270,
        particleCount: 25,
        origin: { y: 0.4 },
        startVelocity: 35,
    };

    confetti({
        ...defaults,
        shapes: ["image"],
        shapeOptions: {
            image: {
                src: "https://particles.js.org/images/pumpkin.svg",
                replaceColor: true,
                width: 32,
                height: 40,
            },
        },
        colors: ["#ff9a00", "#ff7400", "#ff4d00"],
    });

    confetti({
        ...defaults,
        shapes: ["image"],
        shapeOptions: {
            image: {
                src: "https://particles.js.org/images/pine-tree.svg",
                replaceColor: true,
                width: 271,
                height: 351.5,
            },
        },
        colors: ["#8d960f", "#be0f10", "#445404"],
    });

    confetti({
        ...defaults,
        shapes: ["heart"],
        colors: ["#f93963", "#a10864", "#ee0b93"],
    });
};
