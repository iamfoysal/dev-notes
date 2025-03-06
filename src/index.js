document.addEventListener("DOMContentLoaded", () => {
    const cheatSheetContainer = document.getElementById("cheatSheetContainer");
    const topicSelector = document.getElementById("topicSelector");
    const toggleThemeBtn = document.getElementById("toggleTheme");

    const files = ["django.json", "curl.json", "python.json"];

    async function loadTopics() {
        for (let file of files) {
            let response = await fetch(`data/${file}`);
            let data = await response.json();

            let option = document.createElement("option");
            option.value = file;
            option.innerText = data.title;
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

            data.contents.forEach(content => {
                    // content.title show as a header
                    let sectionHeader = document.createElement("div");
                    sectionHeader.classList.add("section-title");
                    sectionHeader.innerText = ` ${content.id} | ${content.title} |`;
                    // sectionHeader.innerText = content.title;
                    cheatSheetDiv.appendChild(sectionHeader);

                content.items.forEach(item => {
    
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
                        setTimeout(() => copyBtn.innerText = "Copy", 1000);
                    };
                    codeBlock.appendChild(copyBtn);

                    itemContainer.appendChild(codeBlock);
                    cheatSheetDiv.appendChild(itemContainer);
                });
            });

            cheatSheetContainer.appendChild(cheatSheetDiv);
            //  add file source to add more data on the file 

            let source = document.createElement("div");

            let paragraph = document.createElement("p");
            paragraph.classList.add("source-paragraph");
            paragraph.innerText = `Help us improve this cheatsheet! If you know any useful ${data.title} commands or tips, feel free to update the source file. Together, we can create a more comprehensive resource! 🚀`;

            cheatSheetContainer.appendChild(paragraph);

            source.classList.add("source");
            source.innerText = `Source: data/${file}`;
            cheatSheetContainer.appendChild(source);

            //  add a paragraph to show the file source
            

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

    loadTopics();
    loadCheatSheet(""); // Show welcome message by default
});
