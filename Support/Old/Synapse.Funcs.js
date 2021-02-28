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

async function GetCurrentAgent(doc) 
{

    if (WebsiteType == 'agent') doc = await $.get('https://synapsesupport.io/tickets'); else doc = document


    return doc.getElementsByClassName('content')[0].firstElementChild.innerHTML.slice(14,-1).trim()

}