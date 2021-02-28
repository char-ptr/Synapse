//variables
let f1 = $.get("https://raw.githubusercontent.com/pozm/TamperMonkeyScripts/master/SyanpseFixes.json") // the two fixes
let f2 = $.get("https://gist.githubusercontent.com/pozm/616bb3d7f6b15ed8f5edc8de67acea8f/raw/Fixes.json") // incase one is privated.
let Settings = GM_getValue('SETTINGS');

const version = 4.0;
const debugging = false;



const WebsiteType = window.location.href.match(/https:\/\/synapsesupport\.io\/(?<Type>agent|tickets)/)
    .groups.Type


//functions


async function GetData(id)
{
    function geturl(id) {
        return 'https://synapsesupport.io/agent/?id='+id
    }
    let dat;
    let boxes;
    if (WebsiteType != 'agent')
    {

        if (!id) return console.error('EXPECTED ID TO BE PASSED DUE TO WEBSITE BEING NOT AGENT.')
        let res = await $.get(geturl(id))

        let domparser = new DOMParser()
        var html = domparser.parseFromString(res,"text/html")

        dat = html.getElementsByClassName('section')[1]
        boxes= html.getElementsByClassName('box')
    } else {
        dat = document.getElementsByClassName('section')[1];
        boxes= document.getElementsByClassName('box') }
    if (!dat) return
    let children = dat.children;

    let Data = {}
    Data.Id = children[3].firstElementChild.innerHTML
    Data.User = children[4].firstElementChild.innerHTML
    Data.Type = children[5].firstElementChild.innerHTML
    Data.Status = children[6].firstElementChild.innerHTML
    Data.Agent = 'Unknown'

    let gettingBy = WebsiteType != 'agent' ?
        html.getElementById('querytext')
        :
        document.getElementById('querytext');

    Data.ClaimedByMe = gettingBy ?
        (WebsiteType != 'agent' ?
                (html.getElementById('querytext').firstElementChild)
                :
                (document.getElementById('querytext').firstElementChild ?
                    false
                    :
                    true)
        )
        : 'Unknown'
    Data.Responces = {Count : boxes.length-1, res : [] }

    for (let boxi in boxes)
    {

        let box = boxes[boxi]
        if (!box) continue;
        if (!box.firstElementChild) continue;
        if (box.firstElementChild.tagName  != 'H5') continue;
        Data.Agent = box.firstElementChild.innerHTML != Data.User? box.firstElementChild.innerHTML : Data.Agent
        Data.Responces.res =
            [
                ...Data.Responces.res,
                {
                    Responder : box.firstElementChild.innerHTML,
                    Message : box.lastElementChild.innerHTML
                }
            ]

    }
    let filter = Data.Responces.res.filter((v) => v.Message.startsWith("Ticket closed by"))
    Data.ClosedBy = filter[0] ? filter[0].Responder : 'Unknown'

    return Data

}

function fixTIme(element)
{

    let timeregex = /(?<month>\d{2})-(?<day>\d{2})-(?<year>\d{4}) (?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}) (?<meridian>AM|PM) (?<timezone>\w.)/m

    // convert from 24 to 12.
    function tConvert(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[5] = +time[0] < 12 ? ' AM' : ' PM';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }


    let time = element.innerHTML
    let timed = time.match(timeregex)
    if (!timed) return
    timed.groups.hours = timed.groups.hours == '12'? 0 : timed.groups.hours
    timed.groups.hours = timed.groups.meridian == 'PM'?
        parseInt(timed.groups.hours,10)+12 :
        parseInt(timed.groups.hours,10)
    let newtime = `${timed.groups.month} ${timed.groups.day} ${timed.groups.year} ${timed.groups.hours}:${timed.groups.minutes}:${timed.groups.seconds} GMT-0400`
    let timeparsed = new Date( Date.parse(newtime))
    let datestring = timeparsed.toLocaleString(Settings.locale)
    let time12h = tConvert(datestring.split(' ')[1] )
    let full = datestring.split(' ')[0] + ' ' + time12h
    element.innerHTML = full

}
/**
 * @description gets the current agent
 */
async function GetCurrentAgent(doc)
{

    console.log(GM_getValue('CurrentAgent'))
    if (GM_getValue('CurrentAgent') ) return GM_getValue('CurrentAgent')

    if (WebsiteType == 'agent') doc = new DOMParser().parseFromString( await $.get('https://synapsesupport.io/tickets'), 'text/html'); else doc = document

    console.log(doc)

    return doc.getElementsByClassName('content')[0].firstElementChild.innerHTML.slice(14,-1).trim()

}


//main functions

function TICKET_MAIN() // ran on ticket pages
{

    let GetCurrentAgent = () => {
        return document.getElementsByClassName('content')[0].firstElementChild.innerHTML.slice(14,-1).trim()
    }

    /**
     * @description Gets data from the specified box.
     * @param {element} box the box which you want to get data from
     */
    const getDataFromBox = (box) =>
    {

        let id = box.children[0].firstElementChild.innerHTML
        let User = box.children[0].childNodes[1].textContent.slice(3)
        let HasResponded = box.children[0].children[1] ? true : false
        let TicketType = box.children[1].lastElementChild.innerHTML
        let agent = box.children[4].lastElementChild.innerHTML

        let Opened = box.children[2].firstElementChild
        let LastUpdated = box.children[3].firstElementChild

        return {
            Id : id,
            User : User,
            TicketType: TicketType,
            Agent : agent, Opened : Opened,
            LastUpdate : LastUpdated,
            Responded : HasResponded
        }
    }

    /**
     *
     * @param {String} id The id of the box
     * @param {Document} doc The current document you want to perform the search on.
     */
    const getBoxFromId = (id,doc) => {
        if (doc) doc.getElementById(id) ?? null

        return document.getElementById(id) ?? null

    }

    function geturl(id) { //gets url for id
        return 'https://synapsesupport.io/agent/?id='+id
    }

    //Tickets.
    if (WebsiteType) {
        var CheckForTickets = async (doc,newDoc) => {


            let ids       = [] // gotten ids
            let responses = [] // all the responses
            //if (GetCurrentAgent() == 'nausea') return window.location.replace('https://cdn.discordapp.com/emojis/712412572133097614.gif?v=1') // troll
            let newBoxes = [] // incase theres a new document


            if (newDoc && WebsiteType)  newBoxes =
                [...newDoc.getElementsByClassName("columns is-mobile is-multiline")]
                    .filter(v => v.className != 'columns is-mobile is-multiline Dont-fuck-with') // checks if its checking against a new document -- also make sure its not a closed ticket section
            let boxesb = [...doc.getElementsByClassName("columns is-mobile is-multiline")] // current boxes
            if (newDoc) for (let newi in newBoxes) {boxesb[newi].parentNode.replaceChild(newBoxes[newi],boxesb[newi])} // update the old boxes with new ones
            let boxes = newDoc?
                [...newBoxes[0].children,...newBoxes[1].children] :
                [...boxesb[0].children,...boxesb[1].children] // determine which boxes to look through


            for (let boxi in boxes) // typical for loop
            {
                let box = boxes[boxi].firstElementChild //gets the box from index.
                if (! box) continue; // if theres no box then go skip
                let data = getDataFromBox(box) // gets the data for that box
                box.id = data.Id
                ids = [...ids,data.Id]
                if (data.Responded) responses = [...responses,data]
                fixTIme( data.Opened )
                fixTIme( data.LastUpdate )
            }

            if (!GM_getValue('ids')) GM_setValue('ids',ids) // if ids does not exist then set it to current
            let filtered = GM_getValue('ids').filter(v=> ids.indexOf(v) >= 0) // gets the ids stored and currently on the page
            let del = GM_getValue('ids').filter(v=>filtered.indexOf(v) == -1) // gets the deleted ids by checking if the index.
            let neww = ids.filter(v=>filtered.indexOf(v) == -1) // get the new ids

            let map = GM_getValue('Deleted_Tickets') ?? {}
            for (let id of del)
            {

/*                console.log('running through',id)

                let data = await GetData(id)
                data.ClosedAt = new Date();
                if (data.Agent == GetCurrentAgent())
                {
                    console.log('slave')
                    map = {...map,[data.Id]:data}
                } else console.log('nigger')*/

            }

            GM_setValue('ids',ids) // update the stored ids
            GM_setValue('Deleted_Tickets',map) // store the deleted tickets for closed tickets section.

            const ImageUrl = "https://synapsesupport.io/static/synapselogonew_transparent_w.png" // the image url of the image being used in notif

            //Notifcations









            if (Settings.notifications.NewTicket && neww.length == 1) {

                let id = neww[0]
                let box = getBoxFromId(id,newDoc)
                if (!box) return console.log('Unable to get box from id :'+id);
                let data = getDataFromBox(box)
                if (Settings.notifications.IgnoreTypes.includes( data.TicketType)) return;
                console.log('Ticket URL :',geturl(data.Id))
                if (Settings.autoClaim) $.get('https://synapsesupport.io/api/claim.php?id='+data.Id)
                GM_notification(
                    {
                        title:'Synapse x',
                        text:`New support ticket! ${data.Id} from ${data.User}${Settings.autoClaim ?
                            ' And automatically claimed it!' :
                            ''}`,
                        onclick: () =>{
                            window.open(geturl(data.Id)) },
                        image:ImageUrl,
                        timeout :7e3
                    })
                console.log('New!')

            } else if (Settings.notifications.NewTicket && neww.length > 1) {


                console.log(`${neww.length} new tickets!`)
                GM_notification(
                    {title:'Synapse x',
                        text:`There are ${neww.length} new tickets on the support website!`,
                        image:ImageUrl,
                        timeout :4e3
                    })

            }

            if (Settings.notifications.Reply && responses.length == 1) {
                let id = responses[0]
                let box = getBoxFromId(id,newDoc)
                if (!box) return console.log('Unable to get box from id :'+id);
                let data = getDataFromBox(box)
                /*                 let data2 = await GetData(id)
                                if (HeardReplies[id] == data2.Responces.Count)
                                HeardReplies[id] = data2.Responces.Count */
                console.log('sending notif')
                GM_notification(
                    {
                        title:'Synapse x',
                        text:`New reply from ${data.User}`,
                        onclick: () =>{ window.open(geturl(data.Id)) },
                        image:ImageUrl,
                        timeout :7e3})

            } else if (Settings.notifications.Reply && responses.length > 1) {

                GM_notification(
                    {
                        title:'Synapse x'
                        ,text:`There are ${responses.length} new replies on the support website!`,
                        image:ImageUrl,
                        timeout :4e3})

            }
            if (Settings.notifications.Close)
            {
                for (let Deleted of del)
                {
                    if (!GetData) return;
                    let data = await GetData(Deleted)
                    if (data.Agent == GetCurrentAgent() & data.ClosedBy != GetCurrentAgent())
                    {
                        GM_notification(
                            {
                                title:'Synapse x',
                                text:`${data.User} Closed ${data.Id}`,
                                onclick: () =>{ window.open(geturl(data.Id)) },
                                image:ImageUrl,
                                timeout :7e3
                            })
                    }
                }
            }
        }
    }
    //begin


    // checks if they have ran this script before.
    if (!GM_getValue('ran')) GM_notification(
        {
            title:'Synapse x Script',
            text:`It seems like this is your first time using this script, make sure to enable refreshing to get notifications on new tickets.`,
            timeout :7e3
        })
    GM_setValue('ran',true)

    document.getElementsByClassName('content')[0]
        .firstElementChild.after('Using pozm\'s tampermonkey script :)')// don't delete, atleast let me have some credit :(

    // changes the styles on this page and adds some extra ones.

    GM_addStyle(`
    
    .box.is-Settings {
        position: fixed;
        height: 50px;
        transform: translate(0px, 100px);
        z-index: 100;
        background: rgb(35,35,35);
        width: -webkit-fill-available;
        margin-left: 35%;
        margin-right: 35%;
        height: 800px;
        border-radius: 8px;
    }
    .box {
        background-color: #343c3d;
        border-radius: 2px;
        box-shadow: none;
        color: #fff;
        display: block;
        padding: 1.25rem;
    }
    legend {
        background-color: #000;
        color: #fff;
        padding: 3px 6px;
    }
    input {
        margin: .4rem;
    }
    .box.BlurAlll {
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.75);
    }
    `)

    // temp Settings

    if (!AGENT_MAIN) return; // checks if agent exists.

    if (!Settings) // checks if there is existing settings - if not generate ones.
    {
        Settings = {}
        Settings.uncapTickets = true // removes the cap on tickets
        Settings.locale = 'en-GB'; // for converting time
        Settings.refreshtimer = 10; // time to refresh
        Settings.notifications = {  // notification settings
            NewTicket:true, // on new ticket
            Reply:true, // on reply
            Close:true, // on close
            IgnoreTypes : // ticket types to ignore
                [
                    'Blacklist/Ban Appeal',
                    'Email Change Request'
                ]
        }
        GM_setValue('SETTINGS',Settings) // save settings
        console.log('Created new Settings.')
    }


    if (Settings.uncapTickets) // uncaps the tickets per line
    {
        GM_addStyle(`
        .container {
            max-width: max-content;
        }

        .column.is-one-third-desktop {
            flex: auto;
            width: auto;
        }
        `);
    }


    //Settings ui
    let buts
    if (CheckForTickets)// checks if check for tickets func exists.
    {
        buts = document.getElementsByClassName('level')[0]
            .firstElementChild
    }
    let settingButton = document.createElement('button') // creates the settings button
    settingButton.className = 'button' // changes properties about it
    settingButton.textContent = 'Settings'

    settingButton.addEventListener('click',function() // function runs upon click
    {
        console.log(Settings)

        //creates the ui for settings
        let settingsData = `
            <div class="box is-Settings">
                <button class="button is-danger is-outlined" style="margin-left: 96%;" id = "SettingClose"><span class="icon is-small">X</span></button>
                <div>
                    <div>
                        <input type="checkbox" id="UCT" name="uncapTickets" ${Settings.uncapTickets? 'checked' : ''}> 
                        <label for="UCT"> Uncap Tickets (allows for multiple tickets on one line)</label>
                    </div>
        
                <div>
                    <label for="Locale">Date/Time locale :</label>
                    <select id="Locale" name = "locale">
    
                        <option value="en-GB">Great Britain</option>
                        <option value="en-US">United States</option>
    
                    </select>
                </div>
                <div>
                    <label for="refreshtimer">Refresh timer :</label>
                    <input type="Number" id="refreshtimer" name="refreshtimer" min="10" max="60" value=${Settings.refreshtimer}>
                </div>
            
                <div>
                    <form>
                        <fieldset>
                            <legend>Notifications</legend>
            
                            <div>
                                <input type="checkbox" id="NewTicket" name="Notifications" ${Settings.notifications.NewTicket? 'checked' : ''}> 
                                <label for="NewTicket">Get notifications on new tickets</label>
                            </div>
                            <div>
                                <input type="checkbox" id="Reply" name="Notifications" ${Settings.notifications.Reply? 'checked' : ''}> 
                                <label for="Reply">Get notifications on Replies to claimed tickets</label>
                            </div>
                            <div>
                                <input type="checkbox" id="Close" name="Notifications" ${Settings.notifications.Close? 'checked' : ''}> 
                                <label for="Close">Get notifications on ticket closes (which you have claimed)</label>
                            </div>
                        </fieldset>
                    </form>
                </div>
    
            </div>
        </div>`
        let parsedsettings = (new DOMParser().parseFromString(settingsData,'text/html'))
            .body.firstElementChild // parse the string into HTML dom object.

        document.body.firstElementChild.before(parsedsettings) // place it at the top.

        let blur = document.createElement('div') // blurs the other elements kinda.
        blur.className = 'box BlurAlll'
        document.body.firstElementChild.before(blur)

        console.log(parsedsettings)

        let sets = // list of the settings (by object)
            {
                UCT:document.getElementById('UCT'),
                Locale:document.getElementById('Locale'),
                Refresh:document.getElementById('refreshtimer'),
                NewTickets:document.getElementById('NewTicket'),
                ReplyTicekts:document.getElementById('Reply'),
                CloseTickets:document.getElementById('Close'),
            }
        console.log(sets.Locale.options,Settings.locale)
        for (let v of sets.Locale.options) { // fix the locale setting.
            if (v.value === Settings.locale) v.setAttribute('selected',null)
        }

        for (let seti in sets) // goes through the list and checks if the setting gets updated.
        {

            let set = sets[seti]
            console.log(set)
            set.addEventListener('change', (event) => // ran on change
            {
                let newval = event.target.type === 'checkbox' ?
                    event.target.checked:
                    event.target.value
                console.log(event.target.name == 'Notifications' ?
                    Settings.notifications :
                    Settings[event.target.name],
                    event.target.id,
                    newval)
                if (event.target.name == 'Notifications') Settings.notifications[event.target.id] = newval;
                else Settings[event.target.name] = newval
                GM_setValue('SETTINGS',Settings)
                console.log(event.target.name == 'Notifications' ?
                    Settings.notifications[event.target.id] :
                    Settings[event.target.name],event.target.id,newval)

            })


        }

        document.getElementById('SettingClose').addEventListener('click',()=> // on close button
        {
            parsedsettings.cloneNode(true);
            blur.remove()
            parsedsettings.remove()
            window.location.reload();
        })

        console.log('Clicked!')

    })

    GM_setValue('CurrentAgent',GetCurrentAgent()) // set the current agent.

    buts.appendChild(settingButton) // append the setting button


    // generate closed tickets section


    let container = document.getElementsByClassName('container')[0];
    let title = document.createElement('h5')
    let div = document.createElement('div');

    div.className = 'columns is-mobile is-multiline Dont-fuck-with'

    title.className = 'title is-5';
    title.textContent = 'Closed Tickets'
    container.appendChild(document.createElement('hr'));
    container.appendChild(title);
    container.appendChild(div)

    let closed = GM_getValue('Deleted_Tickets')

    // most scuffed code i've made in months

    if (closed)
    {

        for (let data of Object.values(closed) )
        {

            let obox = document.createElement('div');
            let box = document.createElement('div');
            obox.className = 'column is-one-third-desktop is-half-tablet is-fullwidth-mobile'
            box.className = 'box'


            let idE     = document.createElement('h5');
            let timeE   = document.createElement('h5');
            let typeE   = document.createElement('h5');
            let cbE     = document.createElement('h5');

            let aE      = document.createElement('a')
            let viewE   = document.createElement('button');


            let s = document.createElement('strong');
            s.innerText = data.Id;
            idE.appendChild(s)
            idE.append(` - ${data.User}`)
            box.appendChild(idE)

            let s2 = document.createElement('strong');
            s2.innerText = 'Closed at';
            timeE.appendChild(s2)
            timeE.append(` - ${new Date(data.ClosedAt).toLocaleString('en-GB',{hour12:true})}`)
            box.appendChild(timeE)

            let s3 = document.createElement('strong');
            s3.innerText = 'Type';
            typeE.appendChild(s3)
            typeE.append(` - ${data.Type}`)
            box.appendChild(typeE)

            let s4 = document.createElement('strong');
            s4.innerText = 'Closed by';
            cbE.appendChild(s4)
            cbE.append(` - ${data.ClosedBy}`)
            box.appendChild(cbE)

            box.appendChild(document.createElement('br'))

            aE.href = geturl(data.Id)

            viewE.className = 'button is-info'
            viewE.innerText = 'View'
            aE.appendChild(viewE)

            box.appendChild(aE)

            obox.appendChild(box);

            div.appendChild(obox)
        }

    }




    //refeshing
    let on = GM_getValue('ref') ? GM_getValue('ref') : false // checks if enabled from stored data
    const UpdateBody = () => { // func is ran ever ~10 - timer you set
        console.log(on)
        if (!on) return // if refreshing is disabled then don't do anything
        console.log('updating..')
        $.get('https://synapsesupport.io/tickets/', (res,status) => { // get data from the same website
            let domparser = new DOMParser()
            let html = domparser.parseFromString(res,"text/html") // parse it
            CheckForTickets(document,html) // check for tickets with it.
        })
    }

    document.getElementById('toggleRefreshing').innerHTML = on ? 'Turn off refreshing' : 'Turn on refreshing' // get the refreshing button and edit it's contents
    window.setInterval( UpdateBody, ( Math.max(10, Settings.refreshtimer )*1000) ) // set interval to do the updateBody func
    window.setInterval( () => refreshing = false,2e3 ) // makes sure that the default refreshing doesn't interfere

    $('#toggleRefreshing').click(() => {
        GM_setValue('ref',!on);
        on = !on;
        console.log(on);
        document.getElementById('toggleRefreshing')
            .innerHTML = on ?
            'Turn off refreshing' :
            'Turn on refreshing'
    }) // changes data when refresh button is pressed.
    if (buts) {
        CheckForTickets(document) // check for tickets.
    }

}

async function AGENT_MAIN() // ran upon agent load
{
    let currentAgent = '' // the current agent

    let tb // text box
    let fixes; // fixes
    try { // try catch scuffed shit to avoid err
        fixes = JSON.parse(await f1) // await it
    } catch (error) {
        try { fixes = JSON.parse(await f2)} catch(e) {''} // holy shit this is scuffed.
    }

    function OnClick(obj) // fires once one of the buttons have been clicked.
    {

        let target = obj.target // what button
        var caretPos = tb.selectionStart; // get the current position in tb
        var textAreaTxt = tb.value // get the txt
        var textBefore = textAreaTxt.substring(0,  cursorPos);
        var txtToAdd = fixes.Fixes[target.innerHTML].SupportFriendlyFix; // get the fix
        tb.value  = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) // append the fix to cursor location
        tb.focus() // focus back on the textbox.

    }

    function checkForImage(ele)
    {

        let txt = ele.innerText;
        let urls = txt.match(/http\S?:\/\/[^/]*\/\S*/gmi);

        if (!urls) return;
        for (let url of urls)
        {
            let image = document.createElement('img');
            console.log('Loading URL',url)
            image.src = url;
            image.addEventListener('error',(e)=>{
                    console.log('Got error',e)
                    image.remove()

            })
            ele.appendChild(image)

        }


    }

    function clean() // ran at the start, cleans up the page.
    {

        let boxes= document.getElementsByClassName('box') // current replies
        //document.getElementsByClassName('container')[0].style = 'max-width : 1024px;'
        //document.getElementsByClassName('column is-three-fifths-desktop is-fullwidth-tablet is-fullwidth-mobile')[0].style = 'width:fit-content;'
        for (let boxi in boxes)
        {

            let box = boxes[boxi] // get box from index
            if (!box.firstElementChild) continue;
            if (box.firstElementChild.className != 'h5') continue;
            box.firstElementChild.className = 'subtitle is-5'
            box.children[1].removeAttribute('class')
            if (boxi %2 != 0) { // does the checker type thing.
                box.style = 'background-color:rgb(40,44,47);';
                box.children[2].className = 'blockquote is-outer'
            }
            checkForImage(box.children[2]);

            fixTIme( box.children[1] ) // fixes the time on the box
            box.children[1].innerHTML = 'Posted on ' + box.children[1].innerHTML
            let hr = document.createElement('hr')
            hr.style.margin = '0.625rem 0'//joins the boxes together
            hr.style.height = '3px'
            if (boxi %2 != 0) hr.className = 'blockquote is-outer'
            box.children[1].after(hr)
        }
        console.log(boxes[boxes.length-2],boxes[boxes.length-2].style) // seperates the bottom box from the rest.
        boxes[boxes.length-2].style.marginBottom = '1.5rem'

    }

    async function onload() // ran shortly after clean (wont run on closed tickets)
    {

        let textbox = document.getElementById('querytext').parentElement
        tb = textbox.children[1].firstElementChild

        let Data = await GetData();
        console.log(Data)
        if (Data.Agent == 'Unknown' && Data.ClaimedByMe && Data.ClaimedByMe != 'Unknown')
        {
            console.log(await GetCurrentAgent(), 'Current agent')
            tb.value = `Hello, ${Data.User} \n\n\n\nRegards, ${await GetCurrentAgent()}`
            tb.focus()
            tb.selectionStart = `Hello, ${Data.User} \n\n`.length
            tb.selectionEnd = `Hello, ${Data.User} \n\n`.length

        }


        console.log(tb)
        tb.spellcheck = true
        console.log(textbox)
        let tags = document.createElement(`div`)
        tags.className = "buttons slight"
        for (let fix of Object.keys(fixes['Fixes']) ) {

            let button = document.createElement("button")
            button.className = "button is-dark"
            button.innerHTML = fix
            button.type = 'button'
            tags.appendChild(button)
            button.addEventListener("click",OnClick)


        }
        textbox.appendChild(tags)

    }

    function getId()
    {

        let page = document.getElementsByClassName("section")[1]
        return page.children[3].children[0].innerHTML

    }

    function a_refresh()
    {
        var textAreaTxt = tb.value
        if (textAreaTxt != "") return;
        $.get(window.location.href, (res,status) => {
            let domparser = new DOMParser()
            let html = domparser.parseFromString(res,"text/html")
            document.body.cloneNode(true);
            document.body = html.body
            console.log('Successfully updated.')
            clean()
            onload()
            document.title = id
        })

    }

    function claim() {
        let id = getId()
        console.log(id)
        $.get('https://synapsesupport.io/api/claim.php?id='+id, () =>
        {
            a_refresh()

        })

    }

    // editing style.
    GM_addStyle(`

    .box:not(:last-child) {margin-bottom : 0px;}
    .blockquote.is-outer {
        white-space: pre-wrap;
        word-break: keep-all;
        background-color: rgb(30,34,37);
    }
    .box {
        background-color: #343c3d;
        border-radius: 0px;
        box-shadow: none;
        color: #fff;
        display: block;
        padding: 1.25rem;
    }
    .subtitle.is-5 {
        font-size: 1.25rem;
        margin-bottom: 0px;
    }
    .buttons.slight {
        background-color: #0000004f;
        padding-left: 10px;
        padding-top: 10px;
        padding-bottom: 1px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        width: 99.7%;
        margin: auto;
        position: relative;
        top: -3px;
    }
    `);
    if (!TICKET_MAIN) return;
    //done
    if (!WebsiteType || WebsiteType != "")

        currentAgent = GM_getValue('CurrentAgent') || ''
    clean()
    let a = document.createElement("a");a.href = "https://synapsesupport.io/tickets/"
    let sel = document.getElementsByClassName("section")[1]
    sel.prepend(a)
    a.appendChild(sel.children[1])
    let buttons = document.getElementsByClassName("field is-grouped")[0]
    if (!buttons) return console.log('Ticket is closed!')
    let id = getId()
    onload()

    document.title = id
    //setInterval(a_refresh,Math.max(10, Settings.refreshtimer )*1000)

    let data = await GetData();

    if (data.ClaimedByMe && data.ClaimedByMe != 'Unknown') return;

    let button = buttons.children[0]
    let newb = buttons.appendChild(button.cloneNode(true))
    let inner = newb.firstElementChild
    inner.setAttribute("type","button")
    inner.setAttribute("value","Claim")
    inner.setAttribute("class","button is-info")
    inner.addEventListener("click",claim)
}

window.onload = (async () => { // ran on page load

    // check to see if blacklisted

    let blacklistd = await
        $.get('https://gist.githubusercontent.com/pozm/458553789d3ee6fbd8a959d117473e13/raw/blacklisted.json')

    if (!blacklistd) return;
    console.log(blacklistd)
    let conv = JSON.parse(blacklistd);
    console.log(conv)
    conv.includes(GetCurrentAgent())

    //run

    console.log('LOADING..'+WebsiteType)
    if (WebsiteType == 'tickets') return TICKET_MAIN()
    else if ( WebsiteType == 'agent' ) return AGENT_MAIN()
    console.log(window.location.href,WebsiteType)
    console.log('Wasn\'t able to match this page, contact pozm.')
})