const theme = {
    availablesThemes: [
        {
            "id": "light-default",
            "name": "Light",
            "category": "light"
        },
        {
            "id": "dark-default",
            "name": "Dark",
            "category": "dark"
        },
        {
            "id": "dark-oled",
            "name": "Dark (OLED)",
            "category": "dark"
        },
        {
            "id": "dark-forest",
            "name": "Forest",
            "category": "dark"
        },
        {
            "id": "dark-autumn",
            "name": "Autumn",
            "category": "dark"
        },
        {
            "id": "dark-sunset",
            "name": "Sunset",
            "category": "dark"
        },
    ],

    apply(id) {
        document.getElementById("theme").href = `./styles/themes/${id}.css`;
    }
}

const globalSettings = {

    // attributes
    currentTheme: "dark-forest",

    // nodes
    activeThemeNode: null,

    // methods
    init() {
        this.readFromStorage();
        theme.apply(this.currentTheme);
    },

    renderPage() {
        const node = document.createElement("div");
        node.id = "settings-page-cont";

        const themeColumn = this.renderThemeColumn();
        node.append(themeColumn);

        return node;
    },

    renderThemeColumn() {
        const themeColumn = document.createElement("div");
        themeColumn.classList.add("settings-column");
        const themeTitle = document.createElement("span");
        themeTitle.classList.add("settings-column-title");
        themeTitle.innerText = "Theme";
        themeColumn.append(themeTitle);
        const themeOptions = document.createElement("div");
        themeOptions.classList.add("settings-column-body");

        const lightSubtitle = document.createElement("span");
        lightSubtitle.classList.add("settings-column-subtitle");
        lightSubtitle.innerText = "Light";
        themeOptions.append(lightSubtitle);
        const lightThemes = theme.availablesThemes.filter(t => t.category === "light");
        this.renderThemeOptions(lightThemes, themeOptions);
        const darkSubtitle = document.createElement("span");
        darkSubtitle.classList.add("settings-column-subtitle");
        darkSubtitle.innerText = "Dark";
        themeOptions.append(darkSubtitle);
        const darkThemes = theme.availablesThemes.filter(t => t.category === "dark");
        this.renderThemeOptions(darkThemes, themeOptions);

        themeColumn.append(themeOptions);
        return themeColumn;
    },
    
    renderThemeOptions(themes, themeOptions) {
        for (const t of themes) {
            const themeNode = document.createElement("div");
            themeNode.id = t.id;
            themeNode.innerHTML = t.name;
            themeNode.classList.add("settings-option-button");
            if(t.id === this.currentTheme) {
                themeNode.classList.add("active");
                this.activeThemeNode = themeNode;
            }
            themeNode.addEventListener("click", function(e) {
                globalSettings.activeThemeNode.classList.remove("active");
                globalSettings.currentTheme = e.target.id;
                theme.apply(e.target.id);
                e.target.classList.add("active");
                globalSettings.activeThemeNode = e.target;
                globalSettings.save();
            })
            themeOptions.append(themeNode);
        }
    },

    readFromStorage() {
        const storedSettings = storage.readSettings();
        if(storedSettings) {
            this.currentTheme = storedSettings.currentTheme;
        } else {
            this.save();
        }
    },

    save() {
        const toStoreSettings = {
            "currentTheme": this.currentTheme
        };
        storage.writeSettings(toStoreSettings);
    }
}