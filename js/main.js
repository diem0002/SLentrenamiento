// Importar las funciones necesarias de Firebase
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Inicializar Firebase
const database = getDatabase();
const auth = getAuth();

// Referencia a la base de datos donde guardaremos la asistencia
const attendanceRef = ref(database, 'attendance');

// Obtener elementos de los formularios y botones
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const attendanceForm = document.getElementById('attendance-form');
const attendanceList = document.getElementById('attendance-list');
const logoutButton = document.getElementById('logout-button');
const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');

// Mostrar botones de acceso al cargar la página
document.getElementById('access-buttons').style.display = 'block';

// Función para manejar el registro
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Usuario registrado con éxito');
      signupForm.reset();
      showAttendanceContainer();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Función para manejar el inicio de sesión
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Inicio de sesión exitoso');
      loginForm.reset();
      showAttendanceContainer();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Función para manejar el cierre de sesión
logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    alert('Cierre de sesión exitoso');
    showAccessButtons();
  }).catch((error) => {
    alert(error.message);
  });
});

// Mostrar formulario de registro
signupButton.addEventListener('click', () => {
  document.getElementById('access-buttons').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
});

// Mostrar formulario de inicio de sesión
loginButton.addEventListener('click', () => {
  document.getElementById('access-buttons').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
});

// Función para mostrar el contenedor de asistencia
function showAttendanceContainer() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('attendance-container').style.display = 'block';
}

// Función para mostrar los botones de acceso
function showAccessButtons() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('attendance-container').style.display = 'none';
  document.getElementById('access-buttons').style.display = 'block';
}

// Función para registrar asistencia
attendanceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtener valores del formulario
  const name = document.getElementById('name').value;
  const day = document.getElementById('day').value;
  const time = document.getElementById('time').value;

  // Crear un objeto con la asistencia
  const attendanceData = {
    name: name,
    day: day,
    time: time,
    timestamp: Date.now()
  };

  // Enviar la asistencia a Firebase
  push(attendanceRef, attendanceData);

  // Limpiar el formulario
  attendanceForm.reset();
});

// Función para mostrar la lista de asistencia en tiempo real
onValue(attendanceRef, (snapshot) => {
  const data = snapshot.val();
  attendanceList.innerHTML = ''; // Limpiar la lista antes de actualizar

  for (const key in data) {
    const entry = data[key];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.day}</td>
      <td>${entry.time}</td>
    `;
    attendanceList.appendChild(row);
  }
});
