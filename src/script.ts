// Gränssnitt för kursinformation
interface CourseInfo {
    code: string;               // Kurskod
    name: string;               // Kursnamn
    progression: 'A' | 'B' | 'C';  // Progression, begränsad till 'A', 'B' eller 'C'
    syllabus: string;           // URL till kursplanen
}

// Funktion för att lägga till eller uppdatera en kurs
function saveCourse(course: CourseInfo): void {
    // Hämta befintliga kurser från localStorage och konvertera till array
    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    // Hitta kursen i listan, om den finns
    const existingIndex = courses.findIndex(c => c.code === course.code);

    if (existingIndex > -1) {
        // Uppdatera befintlig kurs
        courses[existingIndex] = course;
    } else {
        // Lägg till ny kurs
        courses.push(course);
    }

    // Spara den uppdaterade listan med kurser till localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    // Rendera om kurslistan
    renderCourses();
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

        // Kontrollerar att progressionen är giltig innan vi fortsätter
        if (!validateProgression(progressionInput.value.trim().toUpperCase())) {
            alert("Progression måste vara 'A', 'B', eller 'C'.");
            return; // Avbryter funktionen om progressionen inte är giltig
        }

        const courseInfo: CourseInfo = {
            code: codeInput.value.trim(),
            name: nameInput.value.trim(),
            progression: progressionInput.value.trim().toUpperCase() as 'A' | 'B' | 'C',
            syllabus: syllabusInput.value.trim()
        };

        saveCourse(courseInfo);

        // Återställ formuläret
        codeInput.value = '';
        nameInput.value = '';
        progressionInput.value = '';
        syllabusInput.value = '';
        operationInput.value = 'add'; // Återställ operation till 'add'
    });
}


function deleteCourse(courseCode: string): void {
    // Hämta befintliga kurser från localStorage och konvertera till array
    let courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    // Filtrera bort kursen som ska raderas
    courses = courses.filter(course => course.code !== courseCode);

    // Spara den uppdaterade listan till localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    // Uppdatera visningen av kurslistan
    renderCourses();
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