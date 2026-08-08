const themeToggle = document.getElementById("themeToggle");
const THEME_STORAGE_KEY = "chronos_theme";

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeToggle.textContent = theme === "light" ? "☀️" : "🌙";
}

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // localStorage unavailable - theme choice just won't persist across reloads
  }
}

let currentTheme = getSavedTheme() || "dark";
applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
  saveTheme(currentTheme);
});
