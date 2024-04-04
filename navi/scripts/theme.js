const THEMES = {
    "dark-green" : {
        "bg-color" : "#101010",
        "accent-color" : "#e7ffa6",
        "text-accent-color" : "#50690b",
        "border-accent-color" : "#b6ff1c",
        "text-color": "white",
        "secondary-bg-color": "#303030"
    },
    "dark-red" : {
        "bg-color" : "#101010",
        "accent-color" : "#ff6d6d",
        "text-accent-color" : "#690b0b",
        "border-accent-color" : "#ff1c1c",
        "text-color": "white",
        "secondary-bg-color": "#303030"
    },
    "dark-blue" : {
        "bg-color" : "#101010",
        "accent-color" : "#6db4ff",
        "text-accent-color" : "#0b3969",
        "border-accent-color" : "#1c75ff",
        "text-color": "white",
        "secondary-bg-color": "#303030"
    },
    "light-green" : {
        "bg-color" : "#efefef",
        "accent-color" : "#719b00",
        "text-accent-color" : "#fff",
        "border-accent-color" : "#b6ff1c",
        "text-color": "black",
        "secondary-bg-color": "#cfcfcf"
    }
}



function choose_theme(name) {
    const theme = THEMES[name];
    document.documentElement.style.setProperty("--bg-color", theme["bg-color"]);
    document.documentElement.style.setProperty("--accent-color", theme["accent-color"]);
    document.documentElement.style.setProperty("--text-accent-color", theme["text-accent-color"]);
    document.documentElement.style.setProperty("--border-accent-color", theme["border-accent-color"]);
    document.documentElement.style.setProperty("--text-color", theme["text-color"]);
    document.documentElement.style.setProperty("--secondary-bg-color", theme["secondary-bg-color"]);
}


function fill_theme_selection() {
    let themes_html = ""
    for(theme of Object.entries(THEMES)) {
        themes_html += `<div class="theme-select" onclick="choose_theme('${theme[0]}')"><div class="theme-preview" style="--left-color:${theme[1]["bg-color"]}; --right-color:${theme[1]["accent-color"]};"></div></div>`;
    }
    return themes_html
}