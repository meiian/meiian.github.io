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
            media_node.style.cursor = "pointer";
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

async function open_media_popup(url, media, arch=archive) {
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
    pfp_node.src = arch.avatar;

    let toot_header = document.createElement("div");
    toot_header.classList.add("toot-header");

    let toot_pfp = document.createElement("div");
    toot_pfp.classList.add("toot-pfp");
    toot_pfp.appendChild(pfp_node);
    toot_header.appendChild(toot_pfp);

    let toot_account = document.createElement("div");
    toot_account.classList.add("toot-account");
    toot_account.innerHTML = `
        <div class="display-name">${arch.actor.name}</div>
        <div class="handle">@${arch.actor.preferredUsername}</div>
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
