function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetch_account(handle, instance_name) {
    const instance_url = "https://" + instance_name + "/";
    try {
        const acc_response = await fetch(
            instance_url + "api/v1/accounts/lookup?acct=" + handle,
            {
                method: "GET"
            }
        )
        if(acc_response.ok) {
            const json = await acc_response.json();
            return json;
        }
        else
            throw {
                name : 'HttpError',
                error : new Error("Error in getting account infos : " + acc_response.status)
            }
    } catch (error) {
        show_alert("Error in getting account infos from instance.");
    }
}

async function fetch_account_by_id(acc_id, instance_name) {
    const instance_url = "https://" + instance_name + "/";
    try {
        const acc_response = await fetch(
            instance_url + "api/v1/accounts/" + acc_id,
            {
                method: "GET"
            }
        )
        if(acc_response.ok) {
            const json = await acc_response.json();
            return json;
        }
        else
            throw {
                name : 'HttpError',
                error : new Error("Error in getting account infos : " + acc_response.status)
            }
    } catch (error) {
        show_alert("Error in getting account infos from instance.");
    }
}


async function fetch_statuses(acc_id, instance_name, max_id=2^53, since_id=0) {
    const instance_url = "https://" + instance_name + "/";
    try {
        const response = await fetch(
            instance_url + "api/v1/accounts/" + acc_id + "/statuses?limit=40&max_id=" + max_id + "&since_id=" + since_id,
            {
                method: "GET"
            }
        )
        if(response.ok) {
            const json = await response.json();
            return json;
        }
        else
            throw new Error(response.status);
    } catch (error) {
        const min_levels = [0,5,10,15,20,25,30,35,40,45,50,55];
        const now = new Date();
        const minutes = min_levels.filter(x => x > now.getMinutes()).concat([0])[0];
        const hours = (minutes === 0)? now.getHours()+1 : now.getHours();
        const limit_to_go = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 1);
        const delay = limit_to_go - now;
        show_alert(`The distant server is eepy... We should let them rest.<br/>Fetching will restart at ${limit_to_go.toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'})}.`);
        return wait(delay).then(() => fetch_statuses(acc_id, instance_name, max_id));   
    }
}

async function check_instance(instance_name) {
    const instance_url = "https://" + instance_name + "/";
    try {
        const response = await fetch(
            instance_url + "api/v1/instance/",
            {
                method: "GET"
            }
        )
        if(response.ok) {
            const json = await response.json();
            if(json.uri === instance_name || (json.uri + '/') === instance_url) {
                let to_return = {
                    "domain" : json.domain,
                    "title" : json.title
                }
                return true;
            }
            else {
                throw {
                    name : 'ContentError',
                    error : new Error("Error in verifying the instance : Response by server does not meet expectations.")
                }
            }
        }
        else
        throw {
            name : 'HttpError',
            error : new Error("Error in verifying instance : " + response.status)
        }
    } catch (error) {
        show_alert("Error in verifying instance status.<br/>Be sure the instance really exists.");
        return null;
    }
}

async function fetch_oembed(link, instance_name) {
    const instance_url = "https://" + instance_name + "/";
    try {
        const acc_response = await fetch(
            instance_url + "api/oembed?url=" + link,
            {
                method: "GET"
            }
        )
        if(acc_response.ok) {
            const json = await acc_response.json();
            return json;
        }
        else
            throw {
                name : 'HttpError',
                error : new Error("Error in getting embedded status : " + acc_response.status)
            }
    } catch (error) {
        show_alert("Error in getting embedded status.");
    }
}