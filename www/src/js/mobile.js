const toggleSidebar = document.getElementById('toggleSidebar');
const toggleUsers = document.getElementById('toggleUsers');
const sidebar = document.querySelector('.sidebar');
const sidebarRight = document.querySelector('.sidebar-right');
const overlay = document.getElementById('overlay');

function closePanels() {
  console.log("closePanels")
  sidebar.classList.remove('show');
  sidebarRight.classList.remove('show');
  overlay.classList.remove('show');
}

toggleSidebar.addEventListener('click', () => {
  console.log("toggleSidebar")
  sidebar.classList.toggle('show');
  sidebarRight.classList.remove('show');
  overlay.classList.toggle('show');
});

toggleUsers.addEventListener('click', () => {
  console.log("toggleUsers")
  sidebarRight.classList.toggle('show');
  sidebar.classList.remove('show');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', closePanels);
