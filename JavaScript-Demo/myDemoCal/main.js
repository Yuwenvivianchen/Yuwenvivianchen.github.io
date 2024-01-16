// Constants for leap and normal years
const monthLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// DOM elements
const holder = document.getElementById("days");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const ctitle = document.getElementById("calendarTitle");
const cyear = document.getElementById("calendarYear");
const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");

// Current date
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let currentDay = currentDate.getDate();

// Clear form data
function clearForm() {
    const formElements = ["eventId", "eventDate", "eventTime", "eventTitle", "eventColor", "eventDescription"];
    formElements.forEach(element => document.getElementById(element).value = '');
}

// Calculate days in a month
function daysInMonth(month, year) {
    const daysArray = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? monthLeap : monthNormal;
    return daysArray[month];
}

// Get the starting day of the month
function startingDay(month, year) {
    return new Date(year, month, 1).getDay() || 7;
}

// Create calendar view
function refreshCalendar() {
    let calendarHTML = "";
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = startingDay(currentMonth, currentYear);

    for (let i = 1; i < firstDay; i++) {
        calendarHTML += "<li></li>";
    }

    for (let i = 1; i <= totalDays; i++) {
        const day = i < 10 ? `0${i}` : i;
        const month = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
        const date = `${currentYear}-${month}-${day}`;
        const dayClass = (i < currentDay && currentYear === currentDate.getFullYear() && currentMonth === currentDate.getMonth())
            ? "pastdays" : (i === currentDay && currentYear === currentDate.getFullYear() && currentMonth === currentDate.getMonth())
                ? "today todaybox" : "daystocome";

        calendarHTML += `
            <li class="calendar-day" data-date="${date}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <div class="${dayClass}">${i}</div>
                <div class='day-content'></div>
            </li>`;
    }

    holder.innerHTML = calendarHTML;
    ctitle.innerHTML = monthNames[currentMonth];
    cyear.innerHTML = currentYear;
}

refreshCalendar();

// Event listeners for month navigation
prev.addEventListener("click", function (e) {
    e.preventDefault();
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    refreshCalendar();
    updateCalendar();
});

next.addEventListener("click", function (e) {
    e.preventDefault();
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    refreshCalendar();
    updateCalendar();
});

// Event listener for saving and deleting events
saveButton.addEventListener('click', function () {
    const eventId = document.getElementById('eventId').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventColor = document.getElementById('eventColor').value;
    // const eventDescription = document.getElementById('eventDescription').value;

    let eventData = getEventData();

    if (!eventId) {
        let newEvent = {
            "id": Date.now(),
            "date": eventDate,
            "time": eventTime,
            "title": eventTitle,
            "color": eventColor,
            // "description": eventDescription
        };
        eventData.events.push(newEvent);
    } else {
        const foundEvent = eventData.events.find(eData => eData.id == eventId);
        foundEvent.date = eventDate;
        foundEvent.time = eventTime;
        foundEvent.title = eventTitle;
        foundEvent.color = eventColor;
        // foundEvent.description = eventDescription;
    }

    saveEventData(eventData);
    updateCalendar();
    document.getElementById('closeButton').click();
});

deleteButton.addEventListener('click', function () {
    const eventId = document.getElementById('eventId').value;
    if (eventId) {
        let eventData = getEventData();
        eventData.events = eventData.events.filter(eData => eData.id != eventId);
        clearForm();
        saveEventData(eventData);
    } else {
        alert("Data does not exist");
    }
    updateCalendar();
    document.getElementById('closeButton').click();
});

// Get events from localStorage
function getEventData() {
    let eventData = localStorage.getItem('calendarEvents');
    return eventData ? JSON.parse(eventData) : { events: [] };
}

// Save events to localStorage
function saveEventData(eventData) {
    localStorage.setItem('calendarEvents', JSON.stringify(eventData));
}

// Update calendar with events
function updateCalendar() {
    const allContents = document.querySelectorAll('.day-content');
    allContents.forEach(content => {
        content.innerHTML = "";
    });

    const eventData = getEventData();

    eventData.events.forEach(event => {
        const dayElement = document.querySelector(`[data-date="${event.date}"]`);
        if (dayElement) {
            const dayContent = dayElement.querySelector('.day-content');
            const dataDay = document.createElement("div");
            dataDay.id = event.id;
            dataDay.className = "event";
            dataDay.setAttribute("data-bs-toggle", "modal");
            dataDay.setAttribute("data-bs-target", "#exampleModal");
            dataDay.innerHTML = `
                <span class="color-mark" style="background-color: ${event.color};"></span>
                <span class="event-title">${event.title}</span>`;
            dayContent.append(dataDay);
        }
    });

    const events = document.querySelectorAll(".event");
    events.forEach(event => {
        event.addEventListener('click', function (e) {
            const eventID = e.currentTarget.id;
            const storedObject = localStorage.getItem("calendarEvents");
            if (storedObject) {
                const dataObject = JSON.parse(storedObject);
                const foundEvent = dataObject.events.find(eData => eData.id == eventID);
                document.getElementById('eventId').value = foundEvent.id;
                document.getElementById('eventDate').value = foundEvent.date;
                document.getElementById('eventTime').value = foundEvent.time;
                document.getElementById('eventTitle').value = foundEvent.title;
                document.getElementById('eventColor').value = foundEvent.color;
                // document.getElementById(                'eventDescription').value = foundEvent.description;
            } else {
                console.log("No object found for event ID");
            }
            e.stopPropagation();
        });
    });

    const calendarDays = document.querySelectorAll(`[data-date]`);
    calendarDays.forEach(calendarDay => {
        calendarDay.addEventListener('click', function (e) {
            const targetDate = e.currentTarget.getAttribute("data-date");
            clearForm();
            document.getElementById('eventDate').value = targetDate;
        });
    });
}

updateCalendar();

