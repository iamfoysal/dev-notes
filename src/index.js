document.addEventListener("DOMContentLoaded", () => {
  const cheatSheetContainer = document.getElementById("cheatSheetContainer");
  const topicSelector = document.getElementById("topicSelector");
  const toggleThemeBtn = document.getElementById("toggleTheme");

  // Add GitHub links
  const headerControls = document.getElementsByClassName("header-controls")[0];
  const githubStar = document.createElement("a");
  githubStar.href = "https://github.com/iamfoysal/dev-notes.git";
  githubStar.innerText = "⭐ Star";
  githubStar.target = "_blank";
  githubStar.rel = "noopener noreferrer";
  headerControls.appendChild(githubStar);

  const githubEdit = document.createElement("a");
  githubEdit.href = "https://github.com/iamfoysal/dev-notes/tree/dev/data";
  githubEdit.innerText = "✏️ Edit";
  githubEdit.target = "_blank";
  githubEdit.rel = "noopener noreferrer";
  headerControls.appendChild(githubEdit);

  const files = [
    "django.json",
    "curl.json",
    "python.json",
    "laravel.json",
    "git.json",
  ];

  async function loadTopics() {
    const selectedTopic = localStorage.getItem("selectedTopic") ?? "";

    for (let file of files) {
      let response = await fetch(`data/${file}`);
      let data = await response.json();

      let option = document.createElement("option");
      option.value = file;
      option.innerText = data.title;

      //on-select
      option.addEventListener("onClick", () => {
        localStorage.setItem("selectedTopic", file);
      });

      option.selected = file === selectedTopic;
      topicSelector.appendChild(option);
    }
  }

  async function loadCheatSheet(file) {
    if (!file) {
      cheatSheetContainer.innerHTML = `
                <div class="welcome-message">
                   <h2>👋 Hi Devs 🖥️</h2>
                    <p>Feel free to select a topic from the dropdown and start exploring.</p>
                    <p>Happy coding! 🚀</p>
                </div>`;
      return;
    }

    try {
      let response = await fetch(`data/${file}`);
      let data = await response.json();
      localStorage.setItem("selectedTopic", file);
      topicSelector.value = file;

      cheatSheetContainer.innerHTML = "";

      let cheatSheetDiv = document.createElement("div");
      cheatSheetDiv.classList.add("cheat-sheet");

      let sectionHeader = document.createElement("div");
      sectionHeader.classList.add("section-header");
      sectionHeader.innerText = data.title;
      cheatSheetDiv.appendChild(sectionHeader);
      //  add logo
      let logoWrapper = document.createElement("div");
      logoWrapper.classList.add("logo-wrapper");
      let logo = document.createElement("img");
      logo.src = data.logo;
      logo.classList.add("section-header-logo");
      logoWrapper.appendChild(logo);
      sectionHeader.appendChild(logoWrapper);
      //  add discription
      // let description = document.createElement("div");
      // description.classList.add("description");
      // description.innerText = data.description;
      // cheatSheetDiv.appendChild(description);

      data.contents.forEach((content) => {
        // content.title show as a header
        let sectionHeader = document.createElement("div");
        sectionHeader.classList.add("section-title");
        sectionHeader.innerText = `Topic - ${content.id} | ${content.title} |`;
        // sectionHeader.innerText = content.title;
        // ...existing code...
        // sectionHeader.style.color = "#f1f1f1";
        // ...existing code...
        cheatSheetDiv.appendChild(sectionHeader);

        content.items.forEach((item) => {
          let itemContainer = document.createElement("div");
          itemContainer.classList.add("item-container");

          let definition = document.createElement("div");
          definition.classList.add("definition");
          definition.innerText = item.definition;
          itemContainer.appendChild(definition);

          let codeBlock = document.createElement("div");
          codeBlock.classList.add("code-block");

          let codeText = document.createElement("code");
          codeText.innerText = item.code;
          codeBlock.appendChild(codeText);

          let copyBtn = document.createElement("button");
          copyBtn.classList.add("copy-btn");
          copyBtn.innerText = "Copy";
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(item.code);
            copyBtn.innerText = "Copied!";
            setTimeout(() => (copyBtn.innerText = "Copy"), 1000);
          };
          codeBlock.appendChild(copyBtn);

          itemContainer.appendChild(codeBlock);
          cheatSheetDiv.appendChild(itemContainer);
        });
      });

      cheatSheetContainer.appendChild(cheatSheetDiv);

      let source = document.createElement("div");

      let paragraph = document.createElement("p");
      paragraph.classList.add("source-paragraph");
      paragraph.innerText = `Help us improve this cheatsheet! If you know any useful ${data.title} commands or tips, feel free to update the source file. Together, we can create a more comprehensive resource! 🚀`;
      cheatSheetContainer.appendChild(paragraph);

      source.classList.add("source");
      source.innerText = `Source: data/${file}`;
      cheatSheetContainer.appendChild(source);
    } catch (error) {
      console.error("Error loading cheat sheet:", error);
    }
  }

  topicSelector.addEventListener("change", () => {
    let selectedFile = topicSelector.value;
    loadCheatSheet(selectedFile);
  });

  // Theme Toggle
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    let isDarkMode = document.body.classList.contains("dark-mode");
    toggleThemeBtn.innerText = isDarkMode ? "☀️" : "🌙";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleThemeBtn.innerText = "☀️";
  }
  // Load initial data from the local storage
  let selectedTopic = localStorage.getItem("selectedTopic");
  if (selectedTopic) {
    loadCheatSheet(selectedTopic);
  }

  loadTopics();
  loadCheatSheet("");
});
