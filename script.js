document.addEventListener('DOMContentLoaded', () => {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;
  
    // Utility function to save data to localStorage
    const saveData = () => {
      localStorage.setItem('events', JSON.stringify(events));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('registrations', JSON.stringify(registrations));
    };
  
    // Display events on the homepage
    const displayEvents = () => {
      const eventsContainer = document.getElementById('events-container');
      if (eventsContainer) {
        eventsContainer.innerHTML = '';
        events.forEach(event => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');
          eventCard.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <a href="event.html?id=${event.id}">View Details</a>
          `;
          eventsContainer.appendChild(eventCard);
        });
      }
    };
  
// Display event details
const displayEventDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    const event = events.find(event => event.id === parseInt(eventId));
    if (event) {
      const eventDetails = document.getElementById('event-details');
      if (eventDetails) {
        eventDetails.innerHTML = `
          <div class="event-details-box">
            <h2>${event.title}</h2>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <button id="register-button" class="register-button">Register for Event</button>
          </div>
        `;
        
        const registerButton = document.getElementById('register-button');
        if (registerButton) {
          registerButton.onclick = () => registerForEvent(event.id);
        }
      }
    }
  };
  
  
    // Register for event
    const registerForEvent = (eventId) => {
      if (!loggedInUser) {
        alert('You need to log in to register for an event.');
        window.location.href = 'login.html';
        return;
      }
      const alreadyRegistered = registrations.some(reg => reg.eventId === eventId && reg.userId === loggedInUser.id);
      if (alreadyRegistered) {
        alert('You have already registered for this event.');
        return;
      }
      registrations.push({ eventId, userId: loggedInUser.id });
      saveData();
      alert('Successfully registered for the event!');
    };
  
    // Handle user login
    const handleLogin = (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const user = users.find(user => user.email === email && user.password === password);
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        alert('Invalid email or password');
      }
    };
  
    // Handle user registration
    const handleRegister = (event) => {
      event.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const userExists = users.some(user => user.email === email);
      if (userExists) {
        alert('User with this email already exists');
        return;
      }
      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      saveData();
      localStorage.setItem('loggedInUser', JSON.stringify(newUser));
      window.location.href = 'index.html';
    };
  
    // Display user registrations in the dashboard
    const displayUserRegistrations = () => {
      if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
      }
      const userRegistrations = registrations.filter(reg => reg.userId === loggedInUser.id);
      const registrationsContainer = document.getElementById('user-registrations');
      if (registrationsContainer) {
        registrationsContainer.innerHTML = '';
        userRegistrations.forEach(reg => {
          const event = events.find(event => event.id === reg.eventId);
          if (event) {
            const registrationCard = document.createElement('div');
            registrationCard.classList.add('user-registration');
            registrationCard.innerHTML = `
              <h3>${event.title}</h3>
              <p>${event.description}</p>
              <p><strong>Date:</strong> ${event.date}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Price:</strong> ${event.price}</p>
            `;
            registrationsContainer.appendChild(registrationCard);
          }
        });
      }
    };
  
    // Display events in the admin dashboard
    const displayAdminEvents = () => {
      const adminEventsContainer = document.getElementById('admin-events-container');
      if (adminEventsContainer) {
        adminEventsContainer.innerHTML = '';
        events.forEach(event => {
          const adminEventCard = document.createElement('div');
          adminEventCard.classList.add('admin-event');
          adminEventCard.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <button class="delete-button" onclick="deleteEvent(${event.id})" style="background-color: #ff1493; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s, transform 0.2s;">Delete</button>
          `;
          adminEventsContainer.appendChild(adminEventCard);
        });
      }
    };
  
    // Create new event
    const handleCreateEvent = (event) => {
      event.preventDefault();
      const title = document.getElementById('event-title').value;
      const description = document.getElementById('event-description').value;
      const date = document.getElementById('event-date').value;
      const location = document.getElementById('event-location').value;
      const price = document.getElementById('event-price').value;
      const newEvent = { id: Date.now(), title, description, date, location, price };
      events.push(newEvent);
      saveData();
      displayAdminEvents();
    };
  
    // Delete event
    window.deleteEvent = (eventId) => {
      const eventIndex = events.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        events.splice(eventIndex, 1);
        saveData();
        displayAdminEvents();
      }
    };
  
    // Handle logout
    const handleLogout = () => {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    };
  
    // Attach event listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
  
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
      eventForm.addEventListener('submit', handleCreateEvent);
    }
  
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }
  
    // Initialize the appropriate functions based on the current page
    if (document.getElementById('events-container')) {
      displayEvents();
    }
  
    if (document.getElementById('event-details')) {
      displayEventDetails();
    }
  
    if (document.getElementById('user-registrations')) {
      displayUserRegistrations();
    }
  
    if (document.getElementById('admin-events-container')) {
      displayAdminEvents();
    }
  });
  