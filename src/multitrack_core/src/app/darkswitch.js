const html = document.documentElement;
const darkmode_switch = document.querySelector(".darkmode_switch");
const inputs = darkmode_switch.querySelectorAll("input");

// if (localStorage.getItem("dark-mode")) {
//   html.classList.add("theme-dark");
// }

// if (localStorage.getItem("selected-radio")) {
//   darkmode_switch.querySelector(`#${localStorage.getItem("selected-radio")}`).checked =
//     "true";
// }

const setTheme = (theme) => {
  if (theme === "dark") {
    html.classList.add("theme-dark");
    localStorage.setItem("dark-mode", "true");
  } else {
    html.classList.remove("theme-dark");
    localStorage.removeItem("dark-mode");
  }
};

const handleMediaChange = (e) => {
  if (darkmode_switch.querySelector('[type="radio"]:checked').id === "auto") {
    setTheme(e.matches ? "dark" : "light");
  }
};

const handleInputChange = (e) => {
  const themeMode = e.target.id;
  if (
    themeMode === "dark" ||
    (themeMode === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
  localStorage.setItem("selected-radio", themeMode);
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", handleMediaChange);

inputs.forEach((input) => input.addEventListener("input", handleInputChange));

// Set system input as checked after 1s
setTimeout(() => {
  const systemInput = darkmode_switch.querySelector("#auto");
  if (systemInput) {
    systemInput.checked = true;
  }
  const lightInput = darkmode_switch.querySelector("#light");
  if (lightInput) {
    lightInput.checked = false;
  }
  const event = new Event("input");
  systemInput.dispatchEvent(event);
}, 50);