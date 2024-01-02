let acc_id = "";
let account_json = "";
let statuses = [];
let instance_name = "";
let newest_id = 0;
let loaded_save = {};

function create_save_node() {
    const save_obj = {
        account_json : account_json,
        acc_id : acc_id,
        statuses : statuses,
        instance_name : instance_name,
        created: new Date(),
        newest_id: newest_id
    }
    const data_blob = new Blob([JSON.stringify(save_obj)], {type:'text/plain'});
    const data_str = URL.createObjectURL(data_blob);
    let data_node = document.createElement("a");
    data_node.setAttribute("href", data_str);
    data_node.setAttribute("download", save_obj["account_json"]["username"] + "_" + save_obj["created"].toLocaleString('fr-fr').replaceAll(/\/|\:| /g, "_") + ".json");
    data_node.innerText = `Download statuses (${Math.round(data_blob.size/100000)/10} MB)`;
    data_node.id = "save-button";
    data_node.classList.add("button");
    return data_node;
}

function all_media_alts(s) {
    with_alt = s.filter((media) => media["description"] === null);
    if(with_alt.length > 0)
        return false;
    return true;
}

function show_apps_usage(apps) {
    const apps_ordered = Object.entries(apps)
        .sort(([,a],[,b]) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    const top_three = Object.keys(apps_ordered).slice(0, 3);
    let buf_html = ""
    const bloc_size = Math.round(100 / top_three.length);
    for(const a of top_three) {
        buf_html += `
        <div class="app-used" style="width: ${bloc_size}%;">
            <div class="app-nb-posts">${apps[a]} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stickies" viewBox="0 0 16 16">
                <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1z"/>
                <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293z"/>
            </svg></div>
            <div class="app-name">${a}</div>
        </div>
        `
    }
    const html_apps = `
        <div id="apps-used-cont">
            <div id="apps-used-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-window-stack" viewBox="0 0 16 16">
                <path d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M6 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                <path d="M12 1a2 2 0 0 1 2 2 2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM2 12V5a2 2 0 0 1 2-2h9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1m1-4v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8zm12-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2z"/>
            </svg> Most used apps</div>
            ${buf_html}
        </div>
    `;
    return html_apps;
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
                <div id="month-graph-title">Monthly posts</div>
                <div id="graph-zone">
                    ${buf_html}
                </div>
            </div>
    `;

    return html_dates;
}

function top_five_replied(accs) {
    const ordered_accs = Object.entries(accs).sort((a,b) => b[1]-a[1]);
    if(ordered_accs.length === 0)
        return {};
    let max_limit = 5;
    if(max_limit > ordered_accs.length)
        max_limit = ordered_accs.length;
    let ret_dict = {}
    for(let i = 0 ; i < max_limit ; i++) {
        ret_dict[ordered_accs[i][0]] = ordered_accs[i][1];
    }
    return ret_dict;
}

function show_most_replied(accs) {
    const ordered_accs = Object.values(accs).sort((a,b) => b.replies_count - a.replies_count);
    if(ordered_accs.length === 0)
        return 'No replies. :(';
    let max_limit = 5
    if(max_limit > ordered_accs.length)
        max_limit = ordered_accs.length;
    let replied_acc_html = "";
    const max_value = ordered_accs[0].replies_count;
    for(let i = 0 ; i < max_limit ; i++) {
        replied_acc_html += `<div class="top-replies-row"><div class="bar-bg" style="--value: ${Math.round(ordered_accs[i].replies_count/max_value*100)}%"></div><span>#${i+1} <img class="pfp" src="${ordered_accs[i].avatar_static}"> ${display_name_emoji(ordered_accs[i])}</span> <span>${ordered_accs[i].replies_count}</span></div>`
    }
    return replied_acc_html;
}

function word_cloud(l) {
    let word_list = '';
    let max_words = l.length;
    if(max_words > 75)
        max_words = 75;
    const l2 = shuffle(l.slice(0, max_words));
    for(let i = 0; i < max_words; i++) {
        const red = Math.random()*150;
        const blue = Math.random()*150;
        const green = Math.random()*150;
        const font_size = (l2[i][1]/32*10)+8;
        const left = (Math.random()*100);
        const top = (((i + max_words)/max_words)-1)*95;
        const min_bar = Math.random()*15;
        word_list += `<span class="word-in-cloud" style="top: max(${min_bar}px, calc(${top}% - ${font_size/2}px)); left: max(${min_bar}px, calc(${left}% - ${Math.ceil(l[i][0].length/2)}em)); font-size: ${font_size}px; color: rgb(${red},${green},${blue})">${l2[i][0]}</span>`;
    }
    return word_list;
}

async function show_results() {
    const no_reblogs = statuses.filter((s) => s["reblog"] === null);
    const status_with_medias = no_reblogs.filter((s) => s["media_attachments"].length > 0);
    const status_medias_with_alt = status_with_medias.filter((s) => all_media_alts(s["media_attachments"]));
    const reblogs = statuses.filter((s) => s["reblog"] !== null);
    const pureposts = no_reblogs.filter((s) => (s["in_reply_to_account_id"] === null || s["in_reply_to_account_id"] === acc_id));
    const replies = no_reblogs.filter((s) => (s["in_reply_to_account_id"] !== null && s["in_reply_to_account_id"] !== acc_id));

    const pureposts_rate = Math.round(pureposts.length/statuses.length*100);
    const reblogs_rate = Math.round(reblogs.length/statuses.length*100);
    const replies_rate = Math.round(replies.length/statuses.length*100);
    const alt_medias_rate = Math.round(status_medias_with_alt.length/status_with_medias.length*100);

    const most_famous_status_by_reblog = no_reblogs.reduce(function(prev, current) {
        return (prev && prev.reblogs_count > current.reblogs_count) ? prev: current
    });
    const reblog_embed = await fetch_oembed(most_famous_status_by_reblog["url"], instance_name);

    const most_famous_status_by_fav = no_reblogs.reduce(function(prev, current) {
        return (prev && prev.favourites_count > current.favourites_count) ? prev: current
    });
    const fav_embed = await fetch_oembed(most_famous_status_by_fav["url"], instance_name);

    const replies_ids = no_reblogs.map(a => a.in_reply_to_account_id);
    let replies_ids_count = {};

    for(let i = 0; i < replies_ids.length; i++){
        if(replies_ids[i] !== null && replies_ids[i] !== acc_id)
            replies_ids_count[replies_ids[i]] = (replies_ids_count[replies_ids[i]]||0) + 1;
    }

    const five_first_replied = top_five_replied(replies_ids_count);

    let replies_accs = {};
    for (const acc in five_first_replied) {
        replies_accs[acc] = await fetch_account_by_id(acc, instance_name);
        replies_accs[acc]["replies_count"] = five_first_replied[acc];
    }

    apps = {}
    for (const s of no_reblogs){
        if(s["application"] !== null && s["application"] !== undefined) {
            const app_name = s["application"]["name"];
            if(app_name in apps) {
                apps[app_name] += 1;
            }
            else {
                apps[app_name] = 1;
            }
        }
    }

    dates = {}
    for (const s of no_reblogs){
        if(s["created_at"] !== null) {
            const date_creation = new Date(s["created_at"].slice(0, 19));
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

        
    const statuses_text = no_reblogs.map((x) => extractContent(x.content)).map((x) => x.split(/ |'|’+/g));

    const word_counter = {};
 
    statuses_text.forEach(status => status.forEach(word => {
        if(!stopwords.includes(word) && word.length > 1) {
            if (word_counter[word]) {
                word_counter[word] += 1;
            } else {
                word_counter[word] = 1;
            }
        }
    }));

    const word_rank = Object.entries(word_counter).sort((a,b) => b[1]-a[1])

    console.log(word_rank);


    let bg_img = document.createElement("div");
    bg_img.classList.add("img-bg");
    bg_img.style.backgroundImage = `url(${account_json["header_static"]})`;

    let profile_card = document.createElement("div");
    profile_card.id = "profile-card";
    profile_card.innerHTML =
    `
            <div id="profile">
                <img class="profile-picture" src="${account_json["avatar"]}">
                <div class="profile-infos">
                    <div class="profile-name">${display_name_emoji(account_json)}</div>
                    <div class="profile-handle">@${account_json["username"]}</div>
                    <div class="profile-numbers">
                        <div><span>${account_json["statuses_count"]}</span> <span>Posts</span></div>
                        <div><span>${account_json["following_count"]}</span> <span>Followings</span></div>
                        <div><span>${account_json["followers_count"]}</span> <span>Followers</span></div>
                    </div>
                    <div class="profile-date"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                  </svg> ${date_to_string(new Date())}</div>
                </div>
            </div>
    `

    let acc_stats = document.createElement("div");
    acc_stats.id = "stats-cont";
    acc_stats.innerHTML = `
            <div id="repartition-posts">
                <div id="posts-bar">
                    ${(pureposts_rate>0)?'<div id="pureposts-bar" style="--value: ' + pureposts_rate +'%;"><span class="posts-bar-number">' + pureposts_rate + '%</span><span>pure posts</span></div>':''}
                    ${(replies_rate>0)?'<div id="replies-bar" style="--value: ' + replies_rate + '%;"><span class="posts-bar-number">'+ replies_rate + '%</span><span>replies</span></div>':''}
                    ${(reblogs_rate>0)?'<div id="reposts-bar" style="--value: ' + reblogs_rate + '%;"><span class="posts-bar-number">' + reblogs_rate + '%</span><span>reposts</span></div>':''}
                </div>
            </div>
            <div class="row-card">
                <div id="alt-medias-posts">
                    <div id="medias-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                            <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10"/>
                        </svg> Medias
                    </div>
                    <div class="big-number">${alt_medias_rate}%</div>
                    <div class="description">with an alt-text</div>
                </div>
                ${show_apps_usage(apps)}
            </div>
            ${show_month_graph(not_empty_dates)}
            <div id="top-replies">
                <div class="title">Accounts you've sent the most replies</div>
                ${show_most_replied(replies_accs)}
            </div>

            <div id="cloud-word-cont">
                <div class="title">Word cloud</div>
                <div id="cloud-word">
                ${word_cloud(word_rank)}
                </div>
            </div>
    `;

    let embed_cont = document.createElement("div");
    embed_cont.id = "embed-cont";
    embed_cont.innerHTML = `
        <div id="embed-row" class="flex">
            <div class="embed-cell">
                <div class="embed-cell-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                    </svg> Most famous status by reposts count
                </div>
                ${reblog_embed.html}
            </div>
            <div class="embed-cell">
                <div class="embed-cell-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                    </svg> Most famous status by favs count
                </div>
                ${fav_embed.html}
            </div>
        </div>
    `;




    clear_app();
    append_to_app(bg_img);
    append_to_app(profile_card);
    append_to_app(acc_stats);
    append_to_app(embed_cont);
    append_to_app(create_save_node());
}

function show_loader_statuses() {
    clear_app();
    let loader_node = create_loader();
    let desc_node = document.createElement("div");
    desc_node.id = "loader-statuses-desc";
    desc_node.innerHTML = `
        <div id="loader-statuses-desc-1"></div>
        <div id="loader-statuses-desc-2"></div>
    `;
    append_to_app(loader_node);
    append_to_app(desc_node);
}

async function process_statuses() {
    let buf_statuses = [1];
    let max_id = "999999999999999999";
    let max_statuses_nb = account_json["statuses_count"];
    const nb_requests_max = Math.ceil(max_statuses_nb / 40);
    let nb_statuses_fetched = 0;
    let time_of_one_request = 0;
    let calulcated_total_fetch_time = 0;
    let start = 0;
    let end = 0;
    let request_delay = 0;
    let times_of_requests = []
    let average_time = 10000;

    show_loader_statuses();
    let real_start = new Date();
    while(buf_statuses.length > 0) {
        
        start = Date.now();

        buf_statuses = await fetch_statuses(acc_id, instance_name, max_id, newest_id);
        clear_alert();
        end = Date.now();
        time_of_one_request = end - start;
        times_of_requests.push(time_of_one_request);
        if(times_of_requests.length > 50)
            times_of_requests.shift();
        average_time = times_of_requests.reduce((acc, x) => acc + x, 0,) / times_of_requests.length;
        calulcated_total_fetch_time = (average_time * (max_statuses_nb/40));

        
        
        document.getElementById("loader-statuses-desc-1").innerText = `Fetching statuses... Estimated time : ${Math.round(calulcated_total_fetch_time/1000)}s`;
        
        statuses = statuses.concat(buf_statuses);

        if(buf_statuses.length > 0)
            max_id = buf_statuses.slice(-1)[0]["id"];
        nb_statuses_fetched += buf_statuses.length;
        document.getElementById("loader-statuses-desc-2").innerText = `${nb_statuses_fetched} statuses fetched...`;
    }
    let real_end = new Date();
    let real_total_fetch_time = real_end - real_start;
    document.getElementById("loader-statuses-desc-1").innerText = `All public statuses fetched!`;
    document.getElementById("loader-statuses-desc-2").innerText = `${Math.round(real_total_fetch_time/1000)}s to fetch all statuses.`;

    if(statuses.length > 0 && statuses.filter((s) => s["reblog"] === null).length > 0) {
        setTimeout(function(){
            newest_id = get_newest_status_id(statuses);
            show_results();
        }, 2000);
    }
    else {
        document.getElementById("loader-statuses-desc-1").innerText = `Account has 0 public status.`;
        document.getElementById("loader-statuses-desc-2").innerText = `Your account needs public statuses to produce a TootRecap.`;
    }
}

function is_account_good(json) {
    let overlay_node = document.createElement("div");
    overlay_node.classList.add("overlay-cont");
    overlay_node.id = "overlay";

    let acc_show_node = document.createElement("div");
    acc_show_node.classList.add("acc-show-cont");

    let acc_details_node = document.createElement("div");
    acc_details_node.classList.add("acc-details-node");
    acc_details_node.innerHTML = `
        <img class="account-pfp" alt="Maybe your avatar." src="${json.avatar}">
        <div class="profile-infos">
            <div class="profile-name"><b>${display_name_emoji(json)}</b></div>
            <div class="profile-handle">@${json.username}</div>
            <div class="profile-numbers">
                <div><span>${json.statuses_count}</span> <span>Posts</span></div>
                <div><span>${json.following_count}</span> <span>Followings</span></div>
                <div><span>${json.followers_count}</span> <span>Followers</span></div>
            </div>
        </div>
        <div class="flex flex-center">Is it the account you wanted?</div>
    `;
    acc_show_node.appendChild(acc_details_node);

    let button_cont_node = document.createElement("div");
    button_cont_node.classList.add("flex");
    let approve_node = document.createElement("div");
    approve_node.classList.add("button", "button-yes");
    approve_node.innerText = "Yes.";
    approve_node.addEventListener("click", function(){
        document.getElementById("overlay").remove();
        process_statuses();
    });
    let disapprove_node = document.createElement("div");
    disapprove_node.classList.add("button", "button-no");
    disapprove_node.innerText = "No.";
    disapprove_node.addEventListener("click", function() {
        document.getElementById("overlay").remove();
    });
    button_cont_node.appendChild(approve_node);
    button_cont_node.appendChild(disapprove_node);

    acc_show_node.appendChild(button_cont_node);

    overlay_node.appendChild(acc_show_node);

    document.body.append(overlay_node);
}

async function process_handle() {
    statuses = [];
    instance_name = "";
    account_json = "";
    acc_id = "";
    const handle = document.getElementById("handle-input").value;
    let handle_cut = cut_handle(handle);

    if(handle_cut === null) {
        show_alert("The handle you wrote seems to be syntactically incorrect.<br/>Please check your handle looks like @example@example.org");
        return null;
    }

    let instance_infos = await check_instance(handle_cut.instance_name);


    if(instance_infos !== null) {
        instance_name = handle_cut.instance_name;
        account_json = await fetch_account(handle, instance_name);
        acc_id = account_json.id;
        is_account_good(account_json);
    }
}

async function load_save_into_app() {
    instance_name = loaded_save["instance_name"];
    newest_id = loaded_save["newest_id"];
    statuses = statuses.concat(loaded_save["statuses"]);
    const handle = `@${loaded_save["account_json"]["username"]}@${instance_name}`;
    account_json = await fetch_account(handle, instance_name);
    acc_id = account_json.id;
    is_account_good(account_json);
}



document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("handle-input").addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            process_handle();
        }
    });
    
    document.getElementById("drag-drop-statuses").addEventListener("drop", function(e){
        dropHandler(e);
        const retry_read_json = setInterval(function(){
            if(loaded_save["account_json"] !== undefined) {
                clearInterval(retry_read_json);
                load_save_into_app();
            }    
        }, 300);
    });
    document.getElementById("drag-drop-statuses").addEventListener("dragover", dragOverHandler);
});