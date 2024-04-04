const VERSION = "v0.1";

let acc_id = "";
let account_json = "";
let statuses = [];
let instance_name = "";
let newest_id = 0;
let archive = {};
let compressed_file = {};

let filtered_toots = [];
let chunks = [];
let tootObserver;
let loadTootsObserver;
let mediaObserver;
let loadMediasObserver;
let intersecTimeout = null;
let chunk_to_render = 0;
let medias_blobs = {};
let load_more_timeout = null;
let attachments = [];
const media_regex = /.*?\/?(?<url>media_attachments\/files\/.+)/;

function init_app() {
    archive.actor.name = remove_custom_emoji(archive.actor.name);
    fill_attachments();
    clear_app();
    init_explorer_grid();
    const tootObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0,
    };
    tootObserver = new IntersectionObserver(intersectionCallbackToot, tootObserverOptions);

    loadTootsObserver = new IntersectionObserver(intersectionCallbackLoadToots, tootObserverOptions);

    mediaObserver = new IntersectionObserver(intersectionCallbackMedia, tootObserverOptions);

    loadMediasObserver = new IntersectionObserver(intersectionCallbackLoadMedias, tootObserverOptions);
    
    let toots_cont = document.createElement("div");
    toots_cont.id = "toots-cont";

    append_to_explorer(create_left_sidebar());
    append_to_explorer(toots_cont);
    append_to_explorer(create_right_sidebar());

    append_to_explorer(create_mobile_buttons());

    make_toots_page();
}

function make_toots_page() {
    clearInterval(load_more_timeout);
    clear_toots();
    hide_mobile_conts();
    search_toots("");
}

function make_medias_page() {
    clearInterval(load_more_timeout);
    clear_toots();
    hide_mobile_conts();
    show_medias();
}

function make_stats_page() {
    clearInterval(load_more_timeout);
    clear_toots();
    hide_mobile_conts();
    show_stats();
}

function create_right_sidebar() {
    const sidebar_node = document.createElement("div");
    sidebar_node.id = "sidebar-r";

    let search_node = document.createElement("input");
    search_node.type = "text";
    search_node.id = "search-input";
    search_node.setAttribute("placeholder", "Search...")
    search_node.addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            launch_search();
        }
    })

    const search_button = document.createElement("button");
    search_button.innerText = "Search";
    search_button.classList.add("button");
    search_button.id = "search-button";
    search_button.addEventListener("click", function(e) {
        launch_search();
    })

    sidebar_node.appendChild(search_node);

    const date_node = document.createElement("div");
    const label_start_date = document.createElement("div");
    label_start_date.innerHTML = "Start date";
    label_start_date.classList.add("text-muted");
    date_node.appendChild(label_start_date);

    const min_date = new Date(Math.min(...archive.outbox.orderedItems.map(t => new Date(t.published)))).toISOString().slice(0,10);
    const max_date = new Date(Math.max(...archive.outbox.orderedItems.map(t => new Date(t.published)))).toISOString().slice(0,10);

    const start_date = document.createElement("input");
    start_date.type = "date";
    start_date.id = "date-start";
    start_date.value = min_date;
    start_date.min = min_date;
    start_date.max = max_date;
    start_date.addEventListener("change", limit_date_filters);
    date_node.appendChild(start_date);

    const label_end_date = document.createElement("div");
    label_end_date.innerHTML = "End date";
    label_end_date.classList.add("text-muted");
    date_node.appendChild(label_end_date);

    const end_date = document.createElement("input");
    end_date.type = "date";
    end_date.id = "date-end";
    end_date.value = max_date;
    end_date.min = min_date;
    end_date.max = max_date;
    end_date.addEventListener("change", limit_date_filters);
    date_node.appendChild(end_date);

    date_node.id = "date-input-cont"
    sidebar_node.appendChild(date_node);
    sidebar_node.appendChild(search_button);

    return sidebar_node;
}

function create_left_sidebar() {
    const sidebar_node = document.createElement("div");
    sidebar_node.id = "sidebar-l";

    const profile_node = document.createElement("div");
    profile_node.classList.add("profile-cont");
    profile_node.innerHTML = `
        <div class="bg-profile" style="background-image: url(${archive["header"]})"><div class="blur-bg"></div></div>
        <img alt="Profile icon" class="profile-icon" src="${archive.avatar}"/>
        <div class="profile-name">${archive.actor.name}</div>
        <div class="profile-handle">@${archive.actor.preferredUsername}</div>
    `   
    sidebar_node.appendChild(profile_node);

    const menu_items = [
        {name:"Toots", call:make_toots_page},
        {name:"Medias", call:make_medias_page},
        {name:"Stats", call:make_stats_page}
    ]
    const menu_node = document.createElement("div");
    menu_node.classList.add("menu");
    for (item of menu_items) {
        const item_node = document.createElement("button");
        item_node.classList.add("menu-item");
        item_node.innerText = item.name;
        item_node.addEventListener("click", item.call);
        menu_node.appendChild(item_node);
    }
    sidebar_node.appendChild(menu_node);

    const infos_node = document.createElement("div");
    infos_node.classList.add("text-muted")
    infos_node.id = "infos-sidebar"
    infos_node.innerHTML = `
        <div id="themes">
            ${fill_theme_selection()}
        </div>
        <p>Navi ${VERSION}</p>
        <p><a href="https://gitlab.com/Hikariwi/navi">Code source</a></p>
    `;

    sidebar_node.appendChild(infos_node);

    return sidebar_node;
}

function create_title_toots_cont(title, nb) {
    const title_node = document.createElement("div");
    title_node.classList.add("column-title");
    title_node.innerHTML = `${title} <span class="text-muted text-small">${nb}</span>`;
    append_toot(title_node);
}


function init_explorer_grid() {
    const explorer_cont = document.createElement("div");
    explorer_cont.id = "explorer-cont";
    append_to_app(explorer_cont);
}

function append_to_explorer(node) {
    document.getElementById("explorer-cont").appendChild(node);
}

const intersectionCallbackToot = async (entries, observer) => {
    for(entry of entries) {
        if (entry.target.id !== "load-more") {
            if (entry.isIntersecting) {
                const toot_id = entry.target.getAttribute('toot-id');
                const toot_node = document.getElementById(toot_id);
                toot_node.replaceChildren();
                const toot_to_render = filtered_toots.find(t => t.object.id === toot_id);
                const nodes_to_append = await fill_toot(toot_to_render);
                for (node of nodes_to_append) {
                    toot_node.appendChild(node);
                }
                toot_node.removeAttribute("style");
            }
            else {
                entry.target.setAttribute("style","min-height:" + entry.target.getAttribute('set-size') + 'px');
                entry.target.replaceChildren();
            }
        }
    };
};

const intersectionCallbackMedia = async (entries, observer) => {
    for(entry of entries) {
        if (entry.target.id !== "load-more-medias") {
            if (entry.isIntersecting) {
                const media_url = entry.target.getAttribute('media-url');
                const media_node = document.getElementById(media_url);
                media_node.replaceChildren();
                const media_to_render = attachments.find(t => t.url === media_url);
                const node_to_append = await fill_media(media_to_render);
                media_node.appendChild(node_to_append.node);
                if (node_to_append.type === "video") {
                    const play_node = document.createElement("div");
                    play_node.classList.add("play-btn")
                    play_node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                    </svg>`;
                    play_node.addEventListener("click", function(e) {
                        e.stopPropagation();
                        open_media_popup(medias_blobs[media_to_render.url], media_to_render);
                    })
                    media_node.insertBefore(play_node, media_node.firstChild);
                }
                if (node_to_append.type === "audio") {
                    const play_node = document.createElement("div");
                    play_node.classList.add("play-btn")
                    play_node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note-beamed" viewBox="0 0 16 16">
                        <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                        <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                        <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
                    </svg>`;
                    play_node.addEventListener("click", function(e) {
                        e.stopPropagation();
                        open_media_popup(medias_blobs[media_to_render.url], media_to_render);
                    })
                    media_node.insertBefore(play_node, media_node.firstChild);
                }
            }
            else {
                entry.target.replaceChildren();
            }
        }
    };
};

const intersectionCallbackLoadToots = async (entries, observer) => {
    for(entry of entries) {
        if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("load-chunk"));
            document.getElementById("load-more").remove();
            if(chunks[index]) {
                await build_toots(index);
            }
        }
    };
};

const intersectionCallbackLoadMedias = async (entries, observer) => {
    for(entry of entries) {
        if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("load-chunk"));
            document.getElementById("load-more-medias").remove();
            if(chunks[index]) {
                await fill_medias(index);
            }
        }
    };
};

function scroll_to_top() {
    document.getElementById("explorer-cont").scrollTo({ top: 0 });
}
    
function launch_search() {
    search_toots(document.getElementById("search-input").value);
    hide_mobile_conts();
}


function clean_chunks() {
    for(node of [...document.getElementsByClassName("toot-chunk")]) {
        if (node.getAttribute("chunk") !== chunk_to_render)
            node.replaceChildren();
    };   
}


function fill_attachments() {
    attachments = archive.outbox.orderedItems.map(t => {
        if(t.object.attachment && t.type === "Create") {
            const medias = t.object.attachment.flat();
            for (let i=0; i < medias.length ; i++) {
                medias[i].text = t.object.content;
                medias[i].date = t.object.published;
                medias[i].toot_url = t.object.id;
            }
          return medias;
        }
    }).flat().filter(m => m);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("drag-drop-statuses").addEventListener("drop", async function(e){
        e.stopPropagation();
        e.preventDefault();
        await dropHandler(e);
        const retry_read_json = setInterval(function(){
            if(archive["outbox"] !== undefined) {
                clearInterval(retry_read_json);
                init_app();
            }    
        }, 300);
    });
    document.getElementById("drag-drop-statuses").addEventListener("dragover", dragOverHandler);
    document.getElementById("drag-drop-statuses").addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        onClickFileHanlder(e);
        const retry_read_json = setInterval(function(){
            if(archive["outbox"] !== undefined) {
                clearInterval(retry_read_json);
                init_app();
            }    
        }, 300);
    });
    document.getElementById("archive-tuto").addEventListener("click", function() {
        open_media_popup(
            "./img/archive-tuto.png",
            {toot_url:"#", name:"Tutorial for getting an archive", mediaType:"image", date:new Date().toISOString(), text:"To get your archive, go in your Mastodon options on your instance Web interface then in the Import/Export section ask for your archive. It will take some time for it to be ready. Download the zip file when it's ready and load it into Navi!"},
            {avatar:"./img/navi256x256.png", actor:{name:"How to get my archive?", preferredUsername:"Navi"}});
    })
});
