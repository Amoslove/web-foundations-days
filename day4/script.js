

const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounters() {
  const text = noteText.value;
  const characters = text.length;

  const trimmedText = text.trim();
  const words = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.remove("warning", "over");

  if (characters > 200) {
    charCount.classList.add("over");
  } else if (characters > 180) {
    charCount.classList.add("warning");
  }

  localStorage.setItem("note-draft", text);
}

function clearNote() {
  noteText.value = "";
  updateCounters();
  localStorage.removeItem("note-draft");
}

noteText.addEventListener("input", updateCounters);

clearBtn.addEventListener("click", clearNote);

noteText.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    clearNote();
  }
});

function updateThemeButton() {
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Light mode";
  } else {
    themeToggle.textContent = "Dark mode";
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark") ? "dark" : "light";

  localStorage.setItem("note-theme", theme);
  updateThemeButton();
}

themeToggle.addEventListener("click", toggleTheme);

// Restore the saved note when the page opens.
const savedDraft = localStorage.getItem("note-draft");

if (savedDraft !== null) {
  noteText.value = savedDraft;
}

// Restore the saved theme when the page opens.
const savedTheme = localStorage.getItem("note-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

updateCounters();
updateThemeButton();
