/*
    Cuts handle (ex : @Akane@mstdn.shalyu.run) and returns dict of username and instance_name.
    Returns null if handle not correct.
*/
function cut_handle(account_handle) {
    const handle_pattern = new RegExp("^@(?<username>[A-Za-z_]+)@(?<instance_name>[A-Za-z\.]+)$");
    let acc_dict = account_handle.match(handle_pattern)
    if(acc_dict === null || acc_dict.groups.username === undefined || acc_dict.groups.instance_name === undefined)
        return null
    return acc_dict.groups;
}