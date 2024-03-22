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
    sidebar_node.appendChild(search_button);
    return sidebar_node;
}

function create_left_sidebar() {
    const sidebar_node = document.createElement("div");
    sidebar_node.id = "sidebar-l";

    const profile_node = document.createElement("div");
    profile_node.classList.add("profile-cont");
    profile_node.innerHTML = `
        <img alt="Profile icon" class="profile-icon" src="${archive.avatar}"/>
        <div class="profile-name">${archive.actor.name}</div>
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

function search_toots(keyword) {
    filtered_toots = archive.outbox.orderedItems.filter(t => t.object.content !== undefined && t.type === "Create" && t.object.content.toLowerCase().includes(keyword.toLowerCase()));
    clear_toots();
    create_title_toots_cont("Toots", filtered_toots.length);
    scroll_to_top();
    chunks = [...toot_chunks(filtered_toots, 50)];
    if(chunks.length > 0)
        build_toots(0);
}

async function build_toots(i) {
    clearTimeout(load_more_timeout);
    const chunk = chunks[i];
    for(toot of chunk) {
        const toot_node = await build_toot(toot);
        append_toot(toot_node);
        const computed_style = getComputedStyle(toot_node);
        const toot_height = toot_node.clientHeight - parseFloat(computed_style.paddingTop) - parseFloat(computed_style.paddingBottom);
        toot_node.setAttribute("set-size", toot_height);
        tootObserver.observe(toot_node);
        toot_node.replaceChildren();
    }
    if (chunk.length === 50) {
        const load_node = document.createElement("div");
        load_node.classList.add("load-more");
        load_node.setAttribute("load-chunk", i+1);
        load_node.id = "load-more";
        load_more_timeout = setTimeout(function() { append_toot(load_node); loadTootsObserver.observe(load_node); }, 2000);
    } else {
        const end_node = document.createElement("div");
        end_node.classList.add("toots-end");
        end_node.innerHTML = "<span>End of results.<span>";
        append_toot(end_node);
    }
}

function clean_chunks() {
    for(node of [...document.getElementsByClassName("toot-chunk")]) {
        if (node.getAttribute("chunk") !== chunk_to_render)
            node.replaceChildren();
    };   
}

async function render_chunk(index) {
    const chunk_node = document.getElementById("chunk-" + index);
    chunk_node.replaceChildren();
    await build_chunk(chunks[index], chunk_node);
}

function build_empty_chunks(chunks) {
    for (let i = 0; i < chunks.length ; i++) {
        const chunk_node = document.createElement("div");
        chunk_node.classList.add("toot-chunk");
        chunk_node.setAttribute("chunk", i);
        chunk_node.id = "chunk-" + i;
        append_toot(chunk_node);
        tootObserver.observe(chunk_node);
    }
}

async function build_chunk(chunk, chunk_node) {
    for (t of chunk) {
        const toot = await build_toot(t);
        chunk_node.appendChild(toot);
    }
}

function* toot_chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
} 

async function refill_toot(t) {
    return await fill_toot(t);
}

async function fill_toot(t) {
    const pfp_node = document.createElement("img");
    pfp_node.src = archive.avatar;

    let toot_header = document.createElement("div");
    toot_header.classList.add("toot-header");

    let toot_pfp = document.createElement("div");
    toot_pfp.classList.add("toot-pfp");
    toot_pfp.appendChild(pfp_node);
    toot_header.appendChild(toot_pfp);

    let toot_account = document.createElement("div");
    toot_account.classList.add("toot-account");
    toot_account.innerHTML = `
        <div class="display-name">${archive.actor.name}</div>
        <div class="handle">@${archive.actor.preferredUsername}</div>
    `;
    toot_header.appendChild(toot_account);
    
    let toot_date = document.createElement("div")
    toot_date.classList.add("toot-date");
    toot_date.classList.add("text-muted");
    toot_date.innerText = date_to_locale_string(new Date(t.object.published));
    toot_header.appendChild(toot_date);


    let toot_body = document.createElement("div");
    toot_body.classList.add("toot-body");
    toot_body.innerHTML = `
        <div class="toot-body-text">${t.object.content}</div>
    `;


    let toot_medias = document.createElement("div");
    toot_medias.classList.add("toot-medias");
    let medias = [];

    if(t.object.attachment && t.object.attachment.length > 0) {
        let media_node = document.getElementById("div");
        for(x of t.object.attachment) {
            if(x.mediaType.includes("image")) {
                media_node = await load_image(x);
            }
            if(x.mediaType.includes("audio")) {
                media_node = await load_audio(x);
            }
            if(x.mediaType.includes("video")) {
                media_node = await load_video_link(x);
            }
            toot_medias.appendChild(media_node);
            medias.push(x.url);
        };
    }


    let toot_footer = document.createElement("div");
    toot_footer.classList.add("toot-footer");

    return [toot_header, toot_body, toot_medias, toot_footer];
}

async function load_image(x) {
    let url_blob = "";
    if(medias_blobs[x.url]) {
        url_blob = medias_blobs[x.url]
    } else {
        const media_file = compressed_file.find(f => {
            const match_a = f.filename.match(media_regex);
            const match_b = x.url.match(media_regex);
            return match_a && match_b && match_a.groups.url.includes(match_b.groups.url);
        });
        if (media_file) {
            const media_blob = await media_file.getData(new zip.BlobWriter());
            url_blob = URL.createObjectURL(media_blob.slice(0, media_blob.size, x.mediaType))
            medias_blobs[x.url] = url_blob;
        }
        else {
            medias_blobs[x.url] = "";
            url_blob = "";
        }        
    }
    return new Promise(resolve => {
        if (url_blob) {
            const media_node = new Image();
            media_node.onload = function() {resolve(media_node);}
            media_node.src = url_blob;
            media_node.alt = x.name || "";
        }
        else {
            const media_node = document.createElement("div");
            media_node.innerHTML = "<div class='media-error'>Media could not load.</div>"
            resolve(media_node);
        }
    })
}

async function load_video_link(x) {
    let url_blob = "";
    if(medias_blobs[x.url]) {
        url_blob = medias_blobs[x.url]
    } else {
        const media_file = compressed_file.find(f => {
            const match_a = f.filename.match(media_regex);
            const match_b = x.url.match(media_regex);
            return match_a && match_b && match_a.groups.url.includes(match_b.groups.url);
        });
        if (media_file) {
            const media_blob = await media_file.getData(new zip.BlobWriter());
            url_blob = URL.createObjectURL(media_blob.slice(0, media_blob.size, x.mediaType))
            medias_blobs[x.url] = url_blob;
        }
        else {
            medias_blobs[x.url] = "";
            url_blob = "";
        }   
    }
    return new Promise(resolve => {
        if (url_blob) {
            const media_node = document.createElement("a");
            media_node.style.color = "var(--accent-color)";
            media_node.addEventListener("click", function(e) {
                e.stopPropagation();
                open_media_popup(url_blob, x);
            })
            media_node.innerText = "Open video";
            resolve(media_node);
        }
        else {
            const media_node = document.createElement("a");
            media_node.style.color = "var(--accent-color)";
            media_node.innerText = "Video could not load.";
            resolve(media_node);
        }
    })
}

async function load_video(x, controls=false) {
    let url_blob = "";
    if(medias_blobs[x.url]) {
        url_blob = medias_blobs[x.url]
    } else {
        const media_file = compressed_file.find(f => {
            const match_a = f.filename.match(media_regex);
            const match_b = x.url.match(media_regex);
            return match_a && match_b && match_a.groups.url.includes(match_b.groups.url);
        });
        if (media_file) {
            const media_blob = await media_file.getData(new zip.BlobWriter());
            url_blob = URL.createObjectURL(media_blob.slice(0, media_blob.size, x.mediaType))
            medias_blobs[x.url] = url_blob;
        }
        else {
            medias_blobs[x.url] = "";
            url_blob = "";
        }  
    }
    return new Promise(resolve => {
        if (url_blob) {
            const media_node = document.createElement("video");
            if (controls)
                media_node.setAttribute("controls", "controls");
            media_node.onloadeddata = function() {resolve(media_node);}
            media_node.src = url_blob;
            media_node.load();
        }
        else {
            const media_node = document.createElement("div");
            media_node.innerHTML = "<div class='media-error'>Media could not load.</div>"
            resolve(media_node);
        }
    })
}

async function load_audio(x) {
    let url_blob = "";
    if(medias_blobs[x.url]) {
        url_blob = medias_blobs[x.url]
    } else {
        const media_file = compressed_file.find(f => {
            const match_a = f.filename.match(media_regex);
            const match_b = x.url.match(media_regex);
            return match_a && match_b && match_a.groups.url.includes(match_b.groups.url);
        });
        if (media_file) {
            const media_blob = await media_file.getData(new zip.BlobWriter());
            url_blob = URL.createObjectURL(media_blob.slice(0, media_blob.size, x.mediaType))
            medias_blobs[x.url] = url_blob;
        }
        else {
            medias_blobs[x.url] = "";
            url_blob = "";
        }  
    }
    return new Promise(resolve => {
        if (url_blob) {
            const media_node = document.createElement("audio");
            media_node.setAttribute("controls", "controls");
            media_node.onloadeddata = function() {resolve(media_node);}
            media_node.src = url_blob;
            media_node.load();
        }
        else {
            const media_node = document.createElement("div");
            media_node.innerHTML = "<div class='media-error'>Media could not load.</div>"
            resolve(media_node);
        }
    })
}

async function load_audio_preview(x) {
    let url_blob = "";
    if(medias_blobs[x.url]) {
        url_blob = medias_blobs[x.url]
    } else {
        const media_file = compressed_file.find(f => {
            const match_a = f.filename.match(media_regex);
            const match_b = x.url.match(media_regex);
            return match_a && match_b && match_a.groups.url.includes(match_b.groups.url);
        });
        if (media_file) {
            const media_blob = await media_file.getData(new zip.BlobWriter());
            url_blob = URL.createObjectURL(media_blob.slice(0, media_blob.size, x.mediaType))
            medias_blobs[x.url] = url_blob;
        }
        else {
            medias_blobs[x.url] = "";
            url_blob = "";
        }  
    }
    return new Promise(resolve => {
        if (url_blob) {
            const media_node = new Image();
            media_node.onload = function() {resolve(media_node);}
            media_node.src = archive.avatar;
            media_node.alt = "Audio file";
        }
        else {
            const media_node = document.createElement("div");
            media_node.innerHTML = "<div class='media-error'>Media could not load.</div>"
            resolve(media_node);
        }
    })
}

async function build_toot(t) {
    
    let toot_node = document.createElement("div");
    toot_node.classList.add("toot-cont");

    toot_node.addEventListener("click", function(e) {
        e.stopPropagation();
        if(e.target.nodeName !== "A")
            window.open(t.object.id, '_blank').focus();
    })

    toot_node.setAttribute("toot-id", t.object.id);
    toot_node.id = t.object.id;

    const nodes_to_append = await fill_toot(t);
    for(node of nodes_to_append) {
        toot_node.appendChild(node);
    }

    return toot_node;
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

async function show_medias() {
    clearTimeout(load_more_timeout);
    scroll_to_top();
    create_title_toots_cont("Medias", attachments.length);
    media_chunks = [...toot_chunks(attachments, 51)];
    await fill_medias(0);
}

async function fill_medias(i) {
    clearTimeout(load_more_timeout);
    const medias = media_chunks[i];
    const medias_gallery = document.createElement("div");
    medias_gallery.id = "media-gallery";
    for(media of medias) {
        const media_node = await build_media(media);
        medias_gallery.appendChild(media_node);
        mediaObserver.observe(media_node);
    }
    append_toot(medias_gallery)
    if (medias.length === 51) {
        const load_node = document.createElement("div");
        load_node.classList.add("load-more");
        load_node.setAttribute("load-chunk", i+1);
        load_node.id = "load-more-medias";
        load_more_timeout = setTimeout(function() { append_toot(load_node); loadMediasObserver.observe(load_node); }, 1000);
    };
}

async function build_media(media) {
    let media_node = document.createElement("div");
    media_node.classList.add("media-cont");

    media_node.setAttribute("media-hash", media.blurhash);
    media_node.setAttribute("media-url", media.url);
    media_node.id = media.url;

    const node_to_append = await fill_media(media);
    media_node.appendChild(node_to_append.node);

    if (node_to_append.type === "video") {
        const play_node = document.createElement("div");
        play_node.classList.add("play-btn")
        play_node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
        </svg>`;
        play_node.addEventListener("click", function(e) {
            e.stopPropagation();
            open_media_popup(medias_blobs[media.url], media);
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
            open_media_popup(medias_blobs[media.url], media);
        })
        media_node.insertBefore(play_node, media_node.firstChild);
    }
    
    return media_node;
}

async function fill_media(media) {
    let media_node = document.createElement("div");
    let media_type = null;
    if(media.mediaType.includes("image")) {
        const media_content = await load_image(media);
        media_content.classList.add("media-content");
        media_node.appendChild(media_content);
        media_type = "image";
    }
    if(media.mediaType.includes("audio")) {
        const media_content = await load_audio_preview(media);
        media_content.classList.add("media-content");
        media_node.appendChild(media_content);
        media_type = "audio";
    }
    if(media.mediaType.includes("video")) {
        const media_content = await load_video(media);
        media_content.classList.add("media-content");
        media_node.appendChild(media_content);
        media_type = "video";
    }

    media_node.classList.add("media-cell");

    if(media_type.includes("image")) {
        media_node.addEventListener("click", function(e) {
            e.stopPropagation();
            open_media_popup(medias_blobs[media.url], media);
        })
    }

    return {node: media_node, type: media_type};
}

async function open_media_popup(url, media) {
    const media_popup_node = document.createElement("div");
    media_popup_node.id = "show-media-popup";
    
    const whole_cont = document.createElement("div");
    whole_cont.classList.add("media-popup-cont");

    const media_cont = document.createElement("div");
    media_cont.classList.add("media-popup-media");
    if(media.mediaType.includes("image")) {
        media_cont.innerHTML = `
            <img src="${url}" alt="${media.name || ''}" class="media-popup-img">
        `;
    }
    if (media.mediaType.includes("video")) {
        const media_node = await load_video(media, true);
        media_cont.appendChild(media_node);
    }
    if (media.mediaType.includes("audio")) {
        const media_node = await load_audio(media);
        media_cont.appendChild(media_node);
    }
    whole_cont.appendChild(media_cont);

    const text_cont = document.createElement("div");
    text_cont.classList.add("media-popup-text");

    const pfp_node = document.createElement("img");
    pfp_node.src = archive.avatar;

    let toot_header = document.createElement("div");
    toot_header.classList.add("toot-header");

    let toot_pfp = document.createElement("div");
    toot_pfp.classList.add("toot-pfp");
    toot_pfp.appendChild(pfp_node);
    toot_header.appendChild(toot_pfp);

    let toot_account = document.createElement("div");
    toot_account.classList.add("toot-account");
    toot_account.innerHTML = `
        <div class="display-name">${archive.actor.name}</div>
        <div class="handle">@${archive.actor.preferredUsername}</div>
    `;
    toot_header.appendChild(toot_account);
    
    let toot_date = document.createElement("div")
    toot_date.classList.add("toot-date");
    toot_date.classList.add("text-muted");
    toot_date.innerText = date_to_locale_string(new Date(media.date));
    toot_header.appendChild(toot_date);


    let toot_body = document.createElement("div");
    toot_body.classList.add("toot-body");
    toot_body.innerHTML = `
        <div class="toot-body-text">${media.text}</div>
    `;

    text_cont.appendChild(toot_header);
    text_cont.appendChild(toot_body);

    text_cont.addEventListener("click", function(e) {
        e.stopPropagation();
        if(e.target.nodeName !== "A")
            window.open(media.toot_url, '_blank').focus();
    })

    whole_cont.appendChild(text_cont);
    media_popup_node.appendChild(whole_cont);

    media_popup_node.addEventListener("click", function(e) {
        e.stopPropagation();
        if(e.target.id === "show-media-popup") {
            document.getElementById("show-media-popup").remove();
        }
    })

    append_to_app(media_popup_node);
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
    })
});
