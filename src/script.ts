// Gränssnitt för kursinformation
interface CourseInfo {
    code: string;               // Kurskod
    name: string;               // Kursnamn
    progression: 'A' | 'B' | 'C';  // Progression, begränsad till 'A', 'B' eller 'C'
    syllabus: string;           // URL till kursplanen
}

// Funktion för att lägga till en ny kurs
function addCourse(course: CourseInfo): void {
    // Hämta befintliga kurser från localStorage och konvertera till array
    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    // Kontrollera om den nya kurskoden redan finns
    const existingCourse = courses.find(c => c.code === course.code);
    if (existingCourse) {
        console.error('Kurskoden måste vara unik.');
        return;
    }

    // Lägg till den nya kursen i arrayen av kurser
    courses.push(course);

    // Spara den uppdaterade listan med kurser till localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    // Rendera kurslistan på webbsidan
    renderCourses();
}

// Funktion för att uppdatera kursinformation
function updateCourse(code: string, updatedCourse: CourseInfo): void {
    // Hämta befintliga kurser från localStorage och konvertera till array
    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    // Hitta index för den kurs som ska uppdateras
    const index = courses.findIndex(c => c.code === code);
    if (index === -1) {
        console.error('Kursen kunde inte hittas.');
        return;
    }

    // Uppdatera kursinformationen
    courses[index] = updatedCourse;

    // Spara den uppdaterade listan med kurser till localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    // Rendera kurslistan på webbsidan
    renderCourses();
}

// Funktion för att rendera kurserna på webbsidan
function renderCourses(): void {
    // Hämta elementet för kurslistan från HTML-dokumentet
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;

    // Rensa kurslistan
    coursesList.innerHTML = '';

    // Hämta kurser från localStorage och konvertera till array
    const courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    // Skapa HTML-element för varje kurs och lägg till dem i kurslistan
    courses.forEach(course => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div><strong>Kod:</strong> ${course.code}</div>
            <div><strong>Namn:</strong> ${course.name}</div>
            <div><strong>Progression:</strong> ${course.progression}</div>
            <div><strong>Kursplan:</strong> <a href="${course.syllabus}" target="_blank">${course.syllabus}</a></div>
        `;
        coursesList.appendChild(listItem);
    });
}

// Funktion för att validera kursprogression
function validateProgression(progression: string): progression is 'A' | 'B' | 'C' {
    return progression === 'A' || progression === 'B' || progression === 'C';
}

// Händelselyssnare för att lägga till en ny kurs
document.getElementById('add-course-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Hämta input-fält från HTML-dokumentet
    const codeInput = document.getElementById('code') as HTMLInputElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const progressionInput = document.getElementById('progression') as HTMLInputElement;
    const syllabusInput = document.getElementById('syllabus') as HTMLInputElement;

    // Hämta värden från input-fälten och rensa whitespace
    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    const progression = progressionInput.value.trim().toUpperCase();
    const syllabus = syllabusInput.value.trim();

    // Validera kursprogressionen
    if (!validateProgression(progression)) {
        console.error('Ogiltig progression.');
        return;
    }

    // Lägg till den nya kursen
    addCourse({ code, name, progression, syllabus });

    // Återställ input-fälten
    codeInput.value = '';
    nameInput.value = '';
    progressionInput.value = '';
    syllabusInput.value = '';
});

// Rendera kurserna när sidan laddas
renderCourses();
