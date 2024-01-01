/*
    Cuts handle (ex : @Akane@mstdn.shalyu.run) and returns dict of username and instance_name.
    Returns null if handle not correct.
*/
function cut_handle(account_handle) {
    const handle_pattern = new RegExp("^@(?<username>[A-Za-z0-9_]+)@(?<instance_name>[A-Za-z\.]+)$");
    let acc_dict = account_handle.match(handle_pattern)
    if(acc_dict === null || acc_dict.groups.username === undefined || acc_dict.groups.instance_name === undefined)
        return null
    return acc_dict.groups;
}

function display_name_emoji(acc) {
    if(acc.emojis.length == 0)
        return acc.display_name;
    let name = acc.display_name;
    for(const e of acc.emojis) {
        name = name.replaceAll(":" + e.shortcode + ":", "<img class='display-name-emoji' src='" +  e.static_url + "'>")
    }
    return name;
}

function extractContent(s) {
    let s2 = s.replaceAll(/<\/?(br||p) *\/?>/g, " ");
    let span = document.createElement('span');
    span.innerHTML = s2.trim();
    let to_return = span.textContent || span.innerText;
    to_return = to_return.replaceAll(/\@\w+/g, "");
    return to_return.trim();
  };