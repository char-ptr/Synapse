// ==UserScript==
// @name         Synapse support MAIN
// @homepage     https://github.com/pozm/TamperMonkeyScripts
// @version      3.6
// @description  Makes the synapse support website much better (for staff). most notable features are : notifications for (new tickets, replies, and claimed ticketed closes), quick claim , and quick responses on agent page
// @author       Pozm
// @updateURL    https://raw.githubusercontent.com/pozm/TamperMonkeyScripts/master/Synapse.Main.js
// @downloadURL  https://raw.githubusercontent.com/pozm/TamperMonkeyScripts/master/Synapse.Main.js
// @match        http*://*.synapsesupport.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://www.pozm.media/getScript.php?script=Synapse.Funcs
// @require      http://www.pozm.media/getScript.php?script=Synapse.Ticket
// @require      http://www.pozm.media/getScript.php?script=Synapse.Agent
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// ==/UserScript==


if (!TICKET_MAIN) {console.log('Unable to get main')}

const WebsiteType = window.location.href.match(/https:\/\/synapsesupport\.io\/(?<Type>agent|tickets)/)
    .groups.Type

window.onload = (async () => {
    console.log('LOADING..'+WebsiteType)
    if (WebsiteType == 'tickets') return TICKET_MAIN()
    else if ( WebsiteType == 'agent' ) return AGENT_MAIN()
    console.log(window.location.href,WebsiteType)
    console.log('Wasn\'t able to match this page, contact pozm.')
})