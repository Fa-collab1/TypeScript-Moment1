// Gränssnitt för kursinformation
interface CourseInfo {
    code: string;               // Kurskod
    name: string;               // Kursnamn
    progression: 'A' | 'B' | 'C';  // Progression, begränsad till 'A', 'B' eller 'C'
    syllabus: string;           // URL till kursplanen
}

// Funktion för att lägga till eller uppdatera en kurs
function saveCourse(course: CourseInfo): 'added' | 'updated' {
    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');
    const existingIndex = courses.findIndex(c => c.code === course.code);
    let actionResult: 'added' | 'updated';

    if (existingIndex > -1) {
        courses[existingIndex] = course;
        actionResult = 'updated';
    } else {
        courses.push(course);
        actionResult = 'added';
    }

    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();

    return actionResult;
}

// Funktion för att rendera kurserna på webbsidan
function renderCourses(): void {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;

    coursesList.innerHTML = ''; // Rensa befintlig lista

    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    courses.forEach(course => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div><strong>Kod:</strong> ${course.code}</div>
            <div><strong>Namn:</strong> ${course.name}</div>
            <div><strong>Progression:</strong> ${course.progression}</div>
            <div><strong>Kursplan:</strong> <a href="${course.syllabus}" target="_blank">Länk</a></div>
        `;

        // Skapar "Uppdatera"-knappen
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Uppdatera';
        updateButton.classList.add('update-button');
        updateButton.addEventListener('click', function () {
            fillFormForUpdate(course.code);
        });

        // Skapar "Radera"-knappen
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Radera';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            deleteCourse(course.code);
        });

        listItem.appendChild(updateButton);
        listItem.appendChild(deleteButton);
        coursesList.appendChild(listItem);
    });
}

// Funktion för att fylla i formuläret med kursinformation för uppdatering
function fillFormForUpdate(code: string): void {
    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.code === code);
    if (!course) return;

    (document.getElementById('code') as HTMLInputElement).value = course.code;
    (document.getElementById('name') as HTMLInputElement).value = course.name;
    (document.getElementById('progression') as HTMLInputElement).value = course.progression;
    (document.getElementById('syllabus') as HTMLInputElement).value = course.syllabus;
    (document.getElementById('operation') as HTMLInputElement).value = 'update';

    window.scrollTo(0, 0); // Scrolla till toppen för att visa formuläret
}

function setupFormListener(): void {
    document.getElementById('add-course-form')?.addEventListener('submit', function (event) {
        event.preventDefault();

        const codeInput = document.getElementById('code') as HTMLInputElement;
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const progressionInput = document.getElementById('progression') as HTMLInputElement;
        const syllabusInput = document.getElementById('syllabus') as HTMLInputElement;
        const operationInput = document.getElementById('operation') as HTMLInputElement;
        const messageElement = document.getElementById('form-message'); // Hämta meddelandeelementet

        if (!validateProgression(progressionInput.value.trim().toUpperCase())) {
            if (messageElement){ 
                messageElement.textContent = "Progression must be 'A', 'B', or 'C'.";
                messageElement.style.color = 'red';}
            return;
        }

        const actionResult = saveCourse({
            code: codeInput.value.trim(),
            name: nameInput.value.trim(),
            progression: progressionInput.value.trim().toUpperCase() as 'A' | 'B' | 'C',
            syllabus: syllabusInput.value.trim(),
        });

        if (messageElement) {
            messageElement.textContent = `Course ${codeInput.value.trim()} has been ${actionResult}.`;
            messageElement.style.color = 'green';
        }

        setTimeout(() => {
            if (messageElement) messageElement.textContent = ''; // Rensa meddelandetexten
            codeInput.value = '';
            nameInput.value = '';
            progressionInput.value = '';
            syllabusInput.value = '';
            operationInput.value = 'add'; // Återställ operation till 'add'
        }, 3000);
    });
}

function deleteCourse(courseCode: string): void {
    let courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');
    const courseExists = courses.some(course => course.code === courseCode);
    if (!courseExists) return;

    courses = courses.filter(course => course.code !== courseCode);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();

    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.textContent = `Course ${courseCode} has been deleted.`;
        messageElement.style.color = 'green';
        setTimeout(() => {
            messageElement.textContent = ''; // Rensa meddelandetexten
        }, 3000);
    }
}

function validateProgression(progression: string): boolean {
    return ['A', 'B', 'C'].includes(progression);
}

// Initiera sidan
function initPage(): void {
    renderCourses();
    setupFormListener();
}

initPage();
