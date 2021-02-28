"use strict";
const version = 1;
const debugging = true;
//styles
$(`<style>

hr {

    width: 90%;
    margin-left: auto;
    margin-right: auto;
    background-color: rgb(26, 26, 26);
    border-radius: 4px;

}

hr.thick {

    height: 5px;

}

hr.light {

    height: 3px;

}

.S { display: inline; }


input.T {

    border-radius:7px

}
/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
    width: 5px;
    background: transparent;
    z-index: 1;
}


html, body {
    overflow: overlay;
}


/* Track */

/* .body {overflow: overlay} */

::-webkit-scrollbar-track {
    background: transparent;
    z-index: 1;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.575);
    border-radius: 4px;
    z-index: 1;
}

</style>`).appendTo('head');
//icons
$('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">').appendTo('head');
let matcher = window.location.href.match(/https:\/\/synapsesupport\.io\/(?<Type>agent|tickets)/);
//@ts-ignore
const WebsiteType = matcher ? matcher.groups.Type : '';
function GetCurrentAgent() {
    return $('.content').children(':first').text().slice(14, -1).trim();
}
var SYN;
(function (SYN) {
    let TicketType;
    (function (TicketType) {
        TicketType[TicketType["GeneralInquiry"] = 0] = "GeneralInquiry";
        TicketType[TicketType["TechnicalIssues"] = 1] = "TechnicalIssues";
        TicketType[TicketType["AccountAccessIssues"] = 2] = "AccountAccessIssues";
        TicketType[TicketType["BlacklistORBanAppeal"] = 3] = "BlacklistORBanAppeal";
        TicketType[TicketType["BugReport"] = 4] = "BugReport";
        TicketType[TicketType["EmailChangeRequest"] = 5] = "EmailChangeRequest";
        TicketType[TicketType["Unknown"] = 6] = "Unknown";
    })(TicketType || (TicketType = {}));
    function ParseStringIntoTicketType(s) {
        switch (s) {
            case ('Technical Issues'): return TicketType.TechnicalIssues;
            case ('Account Access Issues'): return TicketType.AccountAccessIssues;
            case ('Bug Report'): return TicketType.BugReport;
            case ('Blacklist/Ban Appeal'): return TicketType.BlacklistORBanAppeal;
            case ('Email Change Request'): return TicketType.EmailChangeRequest;
            case ('General Inquiry'): return TicketType.GeneralInquiry;
            default: return TicketType.Unknown;
        }
    }
    SYN.ParseStringIntoTicketType = ParseStringIntoTicketType;
    /**
     * @description Converts a tickettype to a string
     * @param {TicketType} TT The ticket type to convert
     */
    function ParseTicketTypeIntoString(TT) {
        switch (TT) {
            case (TicketType.TechnicalIssues): return 'Technical Issues';
            case (TicketType.AccountAccessIssues): return 'Account Access Issues';
            case (TicketType.BugReport): return 'Bug Report';
            case (TicketType.GeneralInquiry): return 'General Inquiry';
            case (TicketType.BlacklistORBanAppeal): return 'Blacklist/Ban Appeal';
            case (TicketType.EmailChangeRequest): return 'Email Change Request';
            default: return 'Unknown';
        }
    }
    SYN.ParseTicketTypeIntoString = ParseTicketTypeIntoString;
    /**
     *
     * @constructor
     * @param {string} Id the string which is the ID of the ticket
     * @param {string} User the string which represents the user who created the ticket
     * @param {TicketType} TicketType the TicketType of the ticket
     * @param {string} Agent the string which represents who has claimed this ticket
     * @param {Date} Opened the date which represents when the ticket was made
     * @param {Date} LastUpdate the date which represents when the ticket was last updated
     * @param {boolean} Responded the bool which represents if the user has responded
     * @param {Element} Element the element of the box
     * @param {boolean} IsOwner If the ticket category is owner
     */
    class Ticket {
        constructor(data) {
            this.Id = data.Id;
            this.User = data.User;
            this.TicketType = data.TicketType;
            this.Agent = data.Agent;
            this.Opened = data.Opened;
            this.LastUpdate = data.LastUpdate;
            this.Responded = data.Responded;
            this.Element = data.Element;
            this.IsOwner = data.IsOwner;
        }
    }
    SYN.Ticket = Ticket;
    class Agent {
        constructor(data) {
            this.Id = data.Id;
            this.User = data.User;
            this.Type = data.Type;
            this.Agent = data.Agent;
            this.Messages = data.Messages;
            this.Opened = data.Opened;
            this.Status = data.status;
            this.Owned = data.Owned;
        }
    }
    SYN.Agent = Agent;
    class Response {
        constructor(data) {
            this.User = data.User;
            this.Time = data.Time;
            this.isAgent = data.isAgent;
            this.Text = data.Text;
        }
    }
    SYN.Response = Response;
    class Fix {
        // public colour   : string;
        constructor(data) {
            this.name = data.name;
            this.value = data.value;
            // this.colour = data.colour
        }
    }
    SYN.Fix = Fix;
    class Settings {
        constructor(data) {
            this.UncapTickets = data.UncapTickets;
            this.AutoRefresh = data.AutoRefresh;
            this.CustomFixes = data.CustomFixes;
        }
        RemoveFix(fix) {
            this.CustomFixes.splice(this.CustomFixes.indexOf(fix), 1);
        }
    }
    SYN.Settings = Settings;
})(SYN || (SYN = {}));
function StoreData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function GetData(key) {
    return JSON.parse(localStorage.getItem(key));
}
function GetDataFromAgentDocument(doc, modify) {
    let [id, user, type, status, opened] = $(doc).find('.section  strong').get(); // gets all elements whcih are a descendant of section and is a strong tag
    let boxes = $(doc).find('.section > .box').get(); // get the boxes
    let responses = []; // pre initialize the arr
    for (let boxi in boxes) // loop over all the boxes
     {
        let box = boxes[boxi]; // get the value by using index
        let replier = $(box).children('h5'); // self
        let time = $(box).children('p'); // explanatory
        let text = $(box).children('pre'); // stuff
        let isAgent = user.innerText != replier.text(); // checks if the user is not the one gotten from earlier
        responses = [
            ...responses,
            new SYN.Response(// add a new response
            {
                Text: text.text(),
                Time: new Date(time.text().slice(0, -2) + 'GMT-0400'),
                User: replier.text(),
                isAgent: isAgent
            })
        ];
        //modification
        text.css({ 'border-radius': '10px' }); // makes text box rounded
        time.replaceWith(`<h5 class="subtitle is-5">At <span style="font-weight:bold">${new Date(time.text().slice(0, -2) + 'GMT-0400').toLocaleString(undefined, { 'hour12': true })}</span></h5>`); // changes what the time looks like
        replier.replaceWith(`<h4 class="title is-4">${replier.text()}</h4>`); // changes the user
        text.before('<hr class="light">'); // adds a header (line)
    }
    let filter = responses.filter(v => v.isAgent === true); // filter out all results which doesn't have isAgent as true
    return new SYN.Agent({
        Agent: 0 in filter ? filter[0].User : 'N/A',
        Messages: responses,
        Id: id.innerText,
        Opened: new Date(opened.innerText.slice(0, -2) + 'GMT-0400'),
        Type: SYN.ParseStringIntoTicketType(type.innerText),
        User: user.innerText,
        status: status.innerText == 'OPEN',
        Owned: 0 in filter ? filter[0].User == GetData('Agent') : false
    });
}
const getDataFromBox = (box) => {
    let jquery = $(box); // get jquery static
    let id = jquery.children(':first').children(':first').text();
    let User = jquery.children(':first').text().slice(id.length + 3).split(' ')[0];
    let HasResponded = jquery.children(':first').children('span').get(0) ? true : false; // check if a box exists
    let TicketType = jquery.children(':nth-child(2)').children(':last').text();
    let agent = jquery.children(':nth-child(5)').children(':last').text();
    let Opened = new Date(jquery.children(':nth-child(3)').children(':last').text().slice(0, -2) + 'GMT-0400'); // parses the time 
    let LastUpdated = new Date(jquery.children(':nth-child(4)').children(':last').text().slice(0, -2) + 'GMT-0400'); // to a local format
    return new SYN.Ticket({
        Id: id,
        User: User,
        TicketType: SYN.ParseStringIntoTicketType(TicketType),
        Agent: agent,
        Opened: Opened,
        LastUpdate: LastUpdated,
        Responded: HasResponded,
        Element: box,
        IsOwner: jquery.parents('#O').get(0) ? true : false
    });
};
function GetTicketsFromDocument(doc, Modify) {
    let [NonOwner, Owner] = $(doc).find('.columns.is-mobile.is-multiline:not([id="C"])').get();
    if (!Owner || !NonOwner)
        return { 'Error': 33, 'Message': 'Expected to have a /tickets document' };
    NonOwner.setAttribute('id', 'NO');
    Owner.setAttribute('id', 'O');
    if (Modify) {
        NonOwner.setAttribute('style', ';justify-content:center');
        Owner.setAttribute('style', ';justify-content:center');
    }
    let Combined = [...Array.from(NonOwner.children), ...Array.from(Owner.children)];
    let claimed = [];
    let OtherBoxes = [];
    for (let key in Combined) {
        let v = Combined[key];
        if (v.nodeName != 'DIV')
            continue;
        let box = getDataFromBox(v.firstElementChild);
        if (box.Agent == GetCurrentAgent())
            claimed = [...claimed, box];
        else
            OtherBoxes = [...OtherBoxes, box];
        if (Modify) {
            v.setAttribute('id', box.Id);
            //edit styles
            v.firstElementChild?.setAttribute('style', 'display: flex;flex-basis: auto;flex-direction: column;');
            box.Element.children[6].setAttribute('style', 'margin-bottom:7px');
            //fix time
            $(box.Element).children(':nth-child(3)').children(':last').text(box.Opened.toLocaleString(undefined, { hour12: true }));
            $(box.Element).children(':nth-child(4)').children(':last').text(box.LastUpdate.toLocaleString(undefined, { hour12: true }));
            //uncap
            v.setAttribute('style', 'width:auto;flex:auto;flex-grow:.1');
            //claim / abandon in background
            // console.log($(box.Element).children('a[href*="claim"], a[href*="abandon"]'))
            $(box.Element).children('a[href*="claim"], a[href*="abandon"]').click(ele => {
                //console.log('hi')
                let hrf = $(ele.target).attr('href');
                $(ele.target).removeAttr('href');
                $.get(hrf);
            });
        }
    }
    return { 'Error': null, 'Data': { 'Claimed': claimed, 'Other': OtherBoxes, 'Both': [...claimed, ...OtherBoxes] } };
}
function GetArrayOfMissingValues(ch, comp) {
    let missing = ch.filter((v, i) => comp.map(v2 => v2?.Id).indexOf(v?.Id) == -1);
    let neww = comp.filter((v, i) => ch.map(v2 => v2?.Id).indexOf(v?.Id) == -1);
    return {
        missing: missing,
        new: neww
    };
}
function GenerateTicketFromData(data) {
    let creation = $(`<div class="column is-one-third-desktop is-half-tablet is-fullwidth-mobile" id="${data.Id}" style="width:auto;flex:auto;flex-grow:.1">
    
        <div class="box" style="display: flex;flex-basis: auto;flex-direction: column;">
             
            <h5 class="h5"><strong>${data.Id}</strong> - ${data.User}${data.Responded ? '<span class="tag is-success" style="float: right;">1+ new messages</span>' : ''}</h5>
            <h5 class="h5">Ticket Type: <strong>${SYN.ParseTicketTypeIntoString(data.TicketType)}${data.Agent == GetCurrentAgent() ? `, ${data.IsOwner ? 'Normal' : 'Owner'}` : ''}</strong></h5>
            <h5 class="h5">Opened: <strong>${data.Opened.toLocaleString(undefined, { hour12: true })}</strong></h5>
            <h5 class="h5">Last message: <strong>${data.LastUpdate.toLocaleString(undefined, { hour12: true })}</strong></h5>
            <h5 class="h5">Agent: <strong>${data.Agent}</strong></h5><br>
    
            <a class="button is-info" href="../agent/?id=${data.Id}" style="margin-bottom:7px">View</a>
            ${data.Agent == GetCurrentAgent() ?
        `<a class="button is-danger" href="../api/abandon.php?id=${data.Id}">Abandon Ticket</a>` :
        data.Agent == 'N/A' ?
            `<a class="button is-success" href="../api/claim.php?id=${data.Id}">Claim Ticket</a>` :
            ''}
        </div>
    </div>`);
    creation.find('a[href*="claim"], a[href*="abandon"]').click(ele => {
        //console.log('hi')
        let hrf = $(ele.target).attr('href');
        $(ele.target).removeAttr('href');
        $.get(hrf);
    });
    return creation;
}
function TICKET_MAIN() {
    async function refresh(Current) {
        let b = await $.get('');
        let newDoc = new DOMParser().parseFromString(b, 'text/html');
        //console.log(newDoc)
        if (!newDoc)
            return false;
        let tickets = GetTicketsFromDocument(newDoc, false);
        if (tickets.Error)
            console.error(resp.Message); //handle error
        if (!tickets)
            window.location.reload(); //caused by getting signed out
        let ticketsv = GetArrayOfMissingValues(Current.Data?.Other, tickets.Data?.Other);
        let ticketsC = GetArrayOfMissingValues(Current.Data?.Claimed, tickets.Data?.Claimed);
        for (let ticketC of ticketsC.new) {
            GenerateTicketFromData(ticketC).appendTo('#C');
        }
        for (let ticket of ticketsv.new) {
            GenerateTicketFromData(ticket).appendTo(`${ticket.IsOwner ? '#O' : '#NO'}`);
        }
        for (let ticketC of ticketsC.missing) {
            $('#C').find(`[id=${ticketC.Id}]`).remove();
        }
        for (let ticket of ticketsv.missing) {
            $(`${ticket.IsOwner ? '#O' : '#NO'}`).find(`[id=${ticket.Id}]`).remove();
        }
        let newdata = { 'Other': tickets.Data?.Other, 'Claimed': tickets.Data?.Claimed };
        StoreData('MainData', newdata);
        //console.log('Successfully reloaded',ticketsv,ticketsC,newdata)
        return tickets;
    }
    //contentDiv
    let ContentDiv = $('.content');
    // remove refresh button to replace with settings later. 
    $('#toggleRefreshing').remove();
    //settings 
    let Settings = GetData('Settings') ?? new SYN.Settings({ UncapTickets: false, CustomFixes: [], AutoRefresh: false });
    let Setb = $('<a><img style="vertical-align: baseline;" src="https://img.icons8.com/ios/30/ffffff/settings.png"/></a>').appendTo(ContentDiv.find('.buttons'));
    let SettingsUIT = false;
    Setb.click(() => {
        SettingsUIT = !SettingsUIT;
        if (SettingsUIT) {
            $('.container').children('h5:first-of-type').before(`<div id="Settings" style="margin-bottom:1.5rem;">
                <h5 class="title is-3" style="justify-content:center;display:flex;">Settings</h5>
                <hr class="thick">
                <div class="columns is-mobile is-multiline" style="width: 90%;margin-left: auto;margin-right: auto;" id="C">
                    <form id = "SF" style="display:inline">
                                        
                        <input type="checkbox" class="S" name="AutoRefresh" id="AR">
                        <label for="AR">Auto refresh</label>
                        <br>
                        <input type="checkbox" class="S" name="UncapTickets" id="UC">
                        <label for="UC">Uncap Tickets</label>
                        <br>
                        <div id="UF">
                            <div class = "UF" style="display:none;">
                            
                                <input class = "input is-small Name" type="text" placeholder="Name" style="width:10vw">
                                <textarea class = "input is-small Value" type="text" placeholder="Fix" style="width:20vw;margin-bottom:10px;resize:vertical"></textarea>
                                <input class = "button remove" type = "button" value="Delete"style="display:none;">
                                <input class = "button add" type = "button" value="Add" style="display:none;">
                            </div>
                        </div>
                    </form>
                    <br>
                    <p>You may need to reload the page for some settings to take affect.</p>
                </div>
            </div>`);
            let c = $('#SF').children('input[type="checkbox"]');
            c.prop('checked', (i, val) => {
                let name = $(c.get(i)).attr('name');
                return Settings[name];
            });
            c.click((ele) => {
                let name = $(ele.target).attr('name');
                Settings[name] = !Settings[name];
                StoreData('Settings', Settings);
            });
            let deleteF = (ele) => {
                let name = $(ele.target).parent().find('input[class="input is-small Name"]').val();
                let ind = Settings.CustomFixes.filter(v => v.name == name)[0];
                if (!ind)
                    return;
                Settings.CustomFixes.splice(Settings.CustomFixes.indexOf(ind), 1);
                StoreData('Settings', Settings);
                $(ele.target).parent().remove();
            };
            for (let fix of Settings.CustomFixes) {
                let newF = $('#UF').children(':first').clone(true, true).appendTo(('#UF'));
                newF.css({ 'display': 'block' });
                newF.find('input[class="input is-small Name"]').val(fix.name);
                newF.find('textarea[class="input is-small Value"]').val(fix.value);
                newF.find('input[class="button remove"]').css({ 'display': 'inline', "height": "auto" }).click(deleteF);
            }
            let newF = $('#UF').children(':first').clone(true, true).appendTo(('#UF'));
            newF.css({ 'display': 'block' });
            newF.find('input[class="button add"]').css({ 'display': 'inline', "height": "auto" }).click((ele) => {
                let n = $(ele.target).parent().clone(true, true).insertBefore(newF);
                let name = n.find('input[class="input is-small Name"]').val();
                let value = n.find('textarea[class="input is-small Value"]').val();
                n.find('input[class="button remove"]').css({ 'display': 'inline', "height": "auto" }).click(deleteF);
                n.find('input[class="button add"]').css({ 'display': 'none' });
                Settings.CustomFixes = [...Settings.CustomFixes, new SYN.Fix({ name: name, value: value })];
                StoreData('Settings', Settings);
                newF.find('input[class="input is-small Name"]').val("");
                newF.find('textarea[class="input is-small Value"]').val("");
            });
        }
        else
            $('#Settings').remove();
    });
    //uncap
    if (Settings.UncapTickets)
        $('.container').get(0).setAttribute('style', 'max-width: max-content');
    // get tickets from the document
    let resp = GetTicketsFromDocument(document, true); // get the tickets on the current document
    if (resp.Error)
        throw new Error(resp.Message); //handle 
    if (!resp)
        throw new Error('Something went wrong'); // errors
    // get the data from the function
    let [claimed, OtherBoxes] = [resp.Data.Claimed, resp.Data.Other];
    { //website modification
        // Claimed & normal tickets
        $(`<h5 class="title is-5">Claimed Tickets</h5>
        <hr>
        <div class="columns is-mobile is-multiline"style=";justify-content:center"id="C"></div>
        <h5 class="title is-5">Tickets</h5>
        <hr>`).insertBefore('#NO');
        var DivWithClaimedTickets = $('#C');
        //refresh button
        ContentDiv.find('.level-right > .level-item > form').before('<button class="button" style="margin-bottom: auto;margin-right:10px" id="refresh">Refresh</button>').parent()
            .children(':first').click(async () => {
            let r = $('#refresh');
            r.attr('disabled', 'true');
            let a = await refresh(resp);
            if (a)
                resp = a;
            else
                return window.location.reload();
            r.removeAttr('disabled');
        });
        //ticket amounts
        $(`<p style="margin:auto; padding-left:6px">
        Total : ${OtherBoxes.length + claimed.length}
        </p>
        <p style="margin:auto; padding-left:6px">
        Unclaimed : ${OtherBoxes.filter(v => v.Agent == 'N/A').length}
        </p>
        <p style="margin:auto; padding-left:6px">
        Claimed : ${OtherBoxes.filter(v => v.Agent != 'N/A').length + claimed.length} (${claimed.length})
        </p>`).appendTo(ContentDiv.find('.level-left'));
        //fix hr
        $('.container > hr').attr('class', 'thick');
        // make headers look nice
        $('.container > h5').attr('class', 'title is-3');
        $('.container > h5').css({ 'display': 'flex', 'justify-content': "center" });
    }
    // move the claimed tickets to claimed ticket section
    for (let box of claimed) {
        $(box.Element).children(':nth-child(2)').children(':last').append(`, ${box.IsOwner ? 'Owner' : 'Normal'}`); // adds the category to type.
        DivWithClaimedTickets.append(box.Element.parentElement); // append to the claimed ticket div
    }
    let newdata = { 'Other': OtherBoxes, 'Claimed': claimed };
    let olddata = GetData('MainData') ?? newdata;
    let ClaimedSolved = GetArrayOfMissingValues(newdata.Claimed, olddata.Claimed);
    let NewTickets = GetArrayOfMissingValues(olddata.Other, newdata.Other);
    //console.log(ClaimedSolved,NewTickets);
    StoreData('MainData', newdata); // stores data so it can be compared in the future.
    StoreData('Agent', GetCurrentAgent()); //store current agent so it can be used in /agent
    StoreData('Settings', Settings);
    $('<script id="cl">window.clearInterval(interval); console.log("Removed interval")</script>').appendTo('head'); // remove the interval which is obsolete 
    setTimeout(() => $('#cl').remove(), 1e2); // remove the script which removes the interval
    $('body > script').remove(); // remove the script which holds the interval because its obsolete since we removed the interval
    $('.content').children(':first').after(`<p>Using pozm\'s tampermonkey script (V2 ~ ${version})</p>`);
    setInterval(async () => {
        if (Settings.AutoRefresh) {
            let a = await refresh(resp);
            if (a)
                resp = a;
        }
    }, 14e3);
}
function AGENT_MAIN() {
    let reply = GetDataFromAgentDocument(document, true); // get data from the agent page
    let Settings = GetData('Settings') ?? new SYN.Settings({ UncapTickets: false, CustomFixes: [], AutoRefresh: false });
    //console.log(reply)
    function Confirmation(type) {
        let out = confirm(`Are you sure that you want to ${type} ${type == 'ban' ? 'this user' : 'this ticket'}?`);
        //console.log(out)
        if (!out)
            return false;
        switch (type) {
            case ('ban'):
                $('#banned').val('yes');
                $('#controls').submit();
                break;
            case ('solve'):
                $('#solved').val('yes');
                $('#controls').submit();
                break;
        }
        return true;
    }
    $(`<script>${Confirmation.toString()}</script>`).appendTo('head'); // add the confirmation function
    $('#solve').attr('onclick', 'Confirmation(this.id)'); // redirect solve to confirmation
    $('#ban').attr('onclick', 'Confirmation(this.id)'); // redirect ban to confirmation
    if (reply.Agent == 'N/A' && $('strong[style="color: red;"]').get(0)) {
        $('<div class="control" style="margin-left: auto;"><input type="button" id="Claim" class="button is-link" value="Claim"></div>').appendTo('.field.is-grouped');
        $('#Claim').click(async () => {
            await $.get('https://synapsesupport.io/api/claim.php?id=' + reply.Id);
            window.location.reload();
        });
    }
    //fixes
    let controlbox = $('.box').last();
    let textarea = controlbox.find('textarea');
    if (!textarea.get(0))
        return;
    let fixesbox = $('<div class = "box" style="border-radius: 10px;background-color: #282f2f;display:flex;justify-content:center;align-content:center;flex-flow: wrap;"></div>').insertBefore(controlbox.children(':last'));
    function insertInto(ele) {
        ele = ele.target;
        let name = $(ele).val();
        let pos = textarea.prop("selectionStart");
        let currText = textarea.text();
        let textBefore = currText.substring(0, pos);
        let textAfter = currText.substring(pos, currText.length);
        let val = Settings.CustomFixes.filter(v => v.name == name)[0].value;
        val = val.replace('%user%', reply.User);
        val = val.replace('%agent%', GetData('Agent'));
        let sel = val.indexOf('%mouse%') != -1 ? val.indexOf('%mouse%') : (textBefore + val).length;
        val = val.replace('%mouse%', '');
        //console.log(val)
        textarea.text(textBefore + val + textAfter);
        textarea.focus();
        textarea.prop("selectionStart", sel);
        textarea.prop("selectionEnd", sel);
    }
    //console.log('hi')
    for (let fix of Settings.CustomFixes) {
        //console.log(fix)
        $('<input type="button" class = "button" style="margin-right:10px;margin: 3px">').appendTo(fixesbox).val(fix.name).click(insertInto);
    }
}
// ran on page load
$(document).ready(() => {
    //run
    console.log('LOADING..' + WebsiteType);
    switch (WebsiteType) {
        case ('tickets'): return TICKET_MAIN();
        case ('agent'): return AGENT_MAIN();
        default:
            {
                console.log(window.location.href);
                console.log('Wasn\'t able to match this page, contact pozm with a screenshot of this whole console.');
            }
            return;
    }
});
