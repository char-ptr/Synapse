let Settings = GM_getValue('SETTINGS');
let HeardReplies = {}
let settings = {} //deprecated

function TICKET_MAIN()
{
    /**
     * @description gets the current agent
     */
    function GetCurrentAgent() 
    {

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
                if (data.Responded) responses = [...responses,data.Id]
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

                console.log('running through',id)

                let data = await GetData(id)
                data.ClosedAt = new Date();
                if (data.Agent == GetCurrentAgent())
                {
                    console.log('slave')
                    map = {...map,[data.Id]:data}
                } else console.log('nigger')

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
        Settings.uncapTickets = true
        Settings.locale = 'en-GB';
        Settings.refreshtimer = 10;
        Settings.notifications = {
            NewTicket:true,
            Reply:true,
            Close:true,
            IgnoreTypes :
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
