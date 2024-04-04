function search_toots(keyword) {
    const min_date = new Date(get_min_date_filter());
    const max_date = new Date(get_max_date_filter());
    max_date.setDate(max_date.getDate()+1);
    filtered_toots = archive.outbox.orderedItems.filter(t => 
        t.object.content !== undefined
        && t.type === "Create"
        && t.object.content.toLowerCase().includes(keyword.toLowerCase())
        && new Date(t.published).getTime() >= min_date.getTime()
        && new Date(t.published).getTime() < max_date.getTime()
    );
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
        if(t.object.attachment.length > 1) {
            toot_medias.classList.add("toot-medias-2");
        }
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
    toot_footer.innerHTML = `
        <a class="toot-btn" target=”_blank” href="${t.object.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
      </svg></a>
    `;

    return [toot_header, toot_body, toot_medias, toot_footer];
}



async function build_toot(t) {
    
    let toot_node = document.createElement("div");
    toot_node.classList.add("toot-cont");

    toot_node.setAttribute("toot-id", t.object.id);
    toot_node.id = t.object.id;

    const nodes_to_append = await fill_toot(t);
    for(node of nodes_to_append) {
        toot_node.appendChild(node);
    }

    return toot_node;
}