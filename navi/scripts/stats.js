function show_stats() {
    scroll_to_top();
    create_title_toots_cont("Stats", "");

    const stats_node = document.createElement("div");
    stats_node.id = "stats-cont";

    const no_reposts = archive.outbox.orderedItems.filter(t => t.type === "Create");
    
    const alt_rate = get_alt_rate(attachments);
    const toot_repartition = get_toot_repartition(archive.outbox.orderedItems);
    const tags_nb = count_tags(no_reposts);

    

    dates = {}
    for (const t of no_reposts){
        if(t.published !== null) {
            const date_creation = new Date(t.published.slice(0, 19));
            const date_str = date_creation.getFullYear() + "-" + ((date_creation.getMonth()+1 < 10)?'0':'') + (date_creation.getMonth()+1);
            if(date_str in dates) {
                dates[date_str] += 1;
            }
            else {
                dates[date_str] = 1;
            }
        }
    }

    let not_empty_dates = dates;


    if(Object.keys(dates).length !== 0 && dates.constructor === Object)
        not_empty_dates = fill_empty_months(dates);

    stats_node.innerHTML = `
        <div class="stats-row">
            <div class="stats-cell">
                <div class="stats-body">${archive.outbox.totalItems}</div>
                <div class="stats-label">Toots</div>
            </div>
            <div class="stats-cell">
                <div class="stats-body">${Math.floor(alt_rate)}%</div>
                <div class="stats-label">medias with an alt text</div>
            </div>
        </div>
        
        <div class="stats-row">
            <div class="stats-cell">
                <div class="stats-label">Distribution of toot types</div>
                <div id="posts-bar">
                    <div id="pureposts-bar" style="--value: ${toot_repartition.pureposts_rate}%;">
                            <span class="posts-bar-number">${(toot_repartition.pureposts_rate > 0)?(toot_repartition.pureposts_rate + "%"):""}</span>
                    </div>
                    <div id="replies-bar" style="--value: ${toot_repartition.replies_rate}%;">
                            <span class="posts-bar-number">${(toot_repartition.replies_rate > 0)?(toot_repartition.replies_rate + "%"):""}</span>
                    </div>
                    <div id="reposts-bar" style="--value: ${toot_repartition.reposts_rate}%;">
                            <span class="posts-bar-number">${(toot_repartition.reposts_rate > 0)?(toot_repartition.reposts_rate + "%"):""}</span>
                    </div>
                </div>
                <div class="stats-legend">
                    ${(toot_repartition.pureposts_rate > 0)?'<span><div class="color-dot" style="--value:#355c7d"></div> Pure toots</span>':''}
                    ${(toot_repartition.replies_rate > 0)?'<span><div class="color-dot" style="--value:#ee9b00"></div> Replies</span>':''}
                    ${(toot_repartition.reposts_rate > 0)?'<span><div class="color-dot" style="--value:#bb3e03"></div> Reposts</span>':''}
                </div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stats-cell">
                <div class="stats-label">Toots per month</div>
                ${show_month_graph(not_empty_dates)}
            </div>
        </div>

        <div class="stats-row">
            <div class="stats-cell">
                <div class="stats-label">Accounts you've sent the most replies to</div>
                ${build_top_replies(tags_nb)}
                </div>
            </div>
        </div>
    `;
    append_toot(stats_node);
}


function get_alt_rate(medias) {
    return medias.filter(m => m.name).length / medias.length * 100;
}

function get_toot_repartition(toots) {
    const no_reposts = toots.filter(t => t.type === "Create");
    const pureposts_rate = no_reposts.filter(t => t.object.tag.length === 0).length / toots.length * 100;
    const replies_rate = no_reposts.filter(t => t.object.tag.length > 0).length / toots.length * 100;
    const reposts_rate = toots.filter(t => t.type === "Announce").length / toots.length * 100;

    return {
        pureposts_rate: Math.round(pureposts_rate), 
        replies_rate: Math.round(replies_rate),
        reposts_rate: Math.round(reposts_rate)
    };
}

function build_top_replies(tags_nb) {
    let tab_rendered = "";
    const max_rows = (tags_nb.length < 5)?tags_nb.length:5;
    const max_nb = Math.max(...tags_nb.map(t => t.nb));

    for (let i = 0; i < max_rows ; i++) {
        const tag = tags_nb[i];
        tab_rendered += `
            <div class="top-replies-row">
                <div class="bar-bg" style="--value:${Math.round(tag.nb/max_nb*100)}%"></div>
                <span><span class="top-replies-rank">#${i+1}</span> <span class="top-replies-handle">${tag.handle}</span></span>
                <span>${tag.nb}</span>
            </div>
        `
    }
    return tab_rendered;
}

function count_tags(toots) {
    const tags_nb = {};
    for (toot of toots) {
        for (tag of toot.object.tag) {
            if (/@.*?(@.*)?/.test(tag.name)) {
                if (tags_nb[tag.name])
                    tags_nb[tag.name] += 1
                else
                    tags_nb[tag.name] = 1
            }
        }
    }
    return Object.keys(tags_nb).map(tag => {
        return {handle:tag, nb:tags_nb[tag]}
    }).sort((a,b) => b.nb - a.nb);
}

function fill_empty_months(dates) {
    const date_min = Object.keys(dates).sort()[0];
    const date_max = Object.keys(dates).sort().reverse()[0];

    const year_min = parseInt(date_min.slice(0,4));
    const year_max = parseInt(date_max.slice(0,4));

    const month_min = parseInt(date_min.slice(5, 7));
    const month_max = parseInt(date_max.slice(5, 7));

    new_dates = {};
    for(let y = year_min; y <= year_max; y++) {
        let m_min = month_min;
        let m_max = month_max;
        if(y !== year_min)
            m_min = 1;
        if(y !== year_max)
            m_max = 12;
        for(let m = m_min; m <= m_max ; m++) {
            const key_m = y + "-" + ((m < 10)?'0':'') + m;
            if(key_m in dates)
                new_dates[key_m] = dates[key_m];
            else
                new_dates[key_m] = 0;
        }

    }

    return new_dates;
}

function show_month_graph(dates) {
    const dates_ordered = Object.keys(dates).sort().reduce(
            (obj, key) => {
            obj[key] = dates[key];
            return obj;
        }, {}
    );
    const max_value = Math.max(...Object.values(dates));
    let buf_html = "";

    for (const m in dates_ordered) {
        buf_html += `
            <div class="month-bar-cont">
                <div class="month-bar" style="--value:${Math.round(dates[m]/max_value*100)}%">${dates[m]}</div>
                <div class="month-label">${m}</div>
            </div>
        `;
    }

    const html_dates = `
            <div id="month-graph">
                <div id="graph-zone">
                    ${buf_html}
                </div>
            </div>
    `;

    return html_dates;
}