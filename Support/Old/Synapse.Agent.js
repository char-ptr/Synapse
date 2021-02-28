let f1 = $.get("https://raw.githubusercontent.com/pozm/TamperMonkeyScripts/master/SyanpseFixes.json")
let f2 = $.get("https://gist.githubusercontent.com/pozm/616bb3d7f6b15ed8f5edc8de67acea8f/raw/Fixes.json")
async function AGENT_MAIN() 
{
    let currentAgent = ''

    let tb
    let fixes;
    try {
        fixes = JSON.parse(await f1)
    } catch (error) {
        try { fixes = JSON.parse(await f2)} catch(e) {''}
    }

    function OnClick(obj)
    {

        let target = obj.target
        var caretPos = tb.selectionStart;
        var textAreaTxt = tb.value 
        var txtToAdd = fixes[target.innerHTML];
        tb.value  = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos)
        tb.focus()

    }


    function clean() 
    {

        let boxes= document.getElementsByClassName('box')
        for (let boxi in boxes)
        {

            let box = boxes[boxi]
            if (!box.firstElementChild) continue;
            if (box.firstElementChild.className != 'h5') continue;
            box.firstElementChild.className = 'subtitle is-5'
            box.children[1].removeAttribute('class')
            if (boxi %2 != 0) {
                box.style = 'background-color:rgb(40,44,47);';
                box.children[2].className = 'blockquote is-outer'
            }

            fixTIme( box.children[1] )
            box.children[1].innerHTML = 'Posted on ' + box.children[1].innerHTML
            let hr = document.createElement('hr')
            hr.style.margin = '0.625rem 0'
            hr.style.height = '3px'
            if (boxi %2 != 0) hr.className = 'blockquote is-outer'
            box.children[1].after(hr)
        }
        console.log(boxes[boxes.length-2],boxes[boxes.length-2].style)
        boxes[boxes.length-2].style.marginBottom = '1.5rem'

    }

    async function onload()
    {

        let textbox = document.getElementById('querytext').parentElement
        tb = textbox.children[1].firstElementChild

        let Data = await GetData();
        console.log(Data)
        if (Data.Agent == 'Unknown' && Data.ClaimedByMe && Data.ClaimedByMe != 'Unknown') 
        {
            tb.value = `Hello, ${Data.User} \n\n\n\nRegards, ${currentAgent}`
            tb.focus()
            tb.selectionStart = `Hello, ${Data.User} \n\n`.length
            tb.selectionEnd = `Hello, ${Data.User} \n\n`.length
    
        }


        console.log(tb)
        tb.spellcheck = true
        console.log(textbox)
        let tags = document.createElement(`div`)
        tags.className = "buttons slight"
        for (let fix of Object.keys(fixes) ) {

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

    function getUser()
    {

        let page = document.getElementsByClassName("section")[1]
        return page.children[4].children[0].innerHTML

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
        width: 710px;
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