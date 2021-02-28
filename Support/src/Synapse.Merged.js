var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var version = 1;
var debugging = true;
//styles
$("<style>\n\nhr {\n\n    width: 90%;\n    margin-left: auto;\n    margin-right: auto;\n    background-color: rgb(26, 26, 26);\n    border-radius: 4px;\n\n}\n\nhr.thick {\n\n    height: 5px;\n\n}\n\nhr.light {\n\n    height: 3px;\n\n}\n\n.S { display: inline; }\n\n\ninput.T {\n\n    border-radius:7px\n\n}\n/* Hide scrollbar for Chrome, Safari and Opera */\n::-webkit-scrollbar {\n    width: 5px;\n    background: transparent;\n    z-index: 1;\n}\n\n\nhtml, body {\n    overflow: overlay;\n}\n\n\n/* Track */\n\n/* .body {overflow: overlay} */\n\n::-webkit-scrollbar-track {\n    background: transparent;\n    z-index: 1;\n}\n\n::-webkit-scrollbar-thumb {\n    background: rgba(255, 255, 255, 0.575);\n    border-radius: 4px;\n    z-index: 1;\n}\n\n</style>").appendTo('head');
//icons
$('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">').appendTo('head');
var matcher = window.location.href.match(/https:\/\/synapsesupport\.io\/(?<Type>agent|tickets)/);
//@ts-ignore
var WebsiteType = matcher ? matcher.groups.Type : '';
function GetCurrentAgent() {
    return $('.content').children(':first').text().slice(14, -1).trim();
}
var SYN;
(function (SYN) {
    var TicketType;
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
    var Ticket = /** @class */ (function () {
        function Ticket(data) {
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
        return Ticket;
    }());
    SYN.Ticket = Ticket;
    var Agent = /** @class */ (function () {
        function Agent(data) {
            this.Id = data.Id;
            this.User = data.User;
            this.Type = data.Type;
            this.Agent = data.Agent;
            this.Messages = data.Messages;
            this.Opened = data.Opened;
            this.Status = data.status;
            this.Owned = data.Owned;
        }
        return Agent;
    }());
    SYN.Agent = Agent;
    var Response = /** @class */ (function () {
        function Response(data) {
            this.User = data.User;
            this.Time = data.Time;
            this.isAgent = data.isAgent;
            this.Text = data.Text;
        }
        return Response;
    }());
    SYN.Response = Response;
    var Fix = /** @class */ (function () {
        // public colour   : string;
        function Fix(data) {
            this.name = data.name;
            this.value = data.value;
            // this.colour = data.colour
        }
        return Fix;
    }());
    SYN.Fix = Fix;
    var Settings = /** @class */ (function () {
        function Settings(data) {
            this.UncapTickets = data.UncapTickets;
            this.AutoRefresh = data.AutoRefresh;
            this.CustomFixes = data.CustomFixes;
        }
        Settings.prototype.RemoveFix = function (fix) {
            this.CustomFixes.splice(this.CustomFixes.indexOf(fix), 1);
        };
        return Settings;
    }());
    SYN.Settings = Settings;
})(SYN || (SYN = {}));
function StoreData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function GetData(key) {
    return JSON.parse(localStorage.getItem(key));
}
function GetDataFromAgentDocument(doc, modify) {
    var _a = $(doc).find('.section  strong').get(), id = _a[0], user = _a[1], type = _a[2], status = _a[3], opened = _a[4]; // gets all elements whcih are a descendant of section and is a strong tag
    var boxes = $(doc).find('.section > .box').get(); // get the boxes
    var responses = []; // pre initialize the arr
    for (var boxi in boxes) // loop over all the boxes
     {
        var box = boxes[boxi]; // get the value by using index
        var replier = $(box).children('h5'); // self
        var time = $(box).children('p'); // explanatory
        var text = $(box).children('pre'); // stuff
        var isAgent = user.innerText != replier.text(); // checks if the user is not the one gotten from earlier
        responses = __spreadArrays(responses, [
            new SYN.Response(// add a new response
            {
                Text: text.text(),
                Time: new Date(time.text().slice(0, -2) + 'GMT-0400'),
                User: replier.text(),
                isAgent: isAgent
            })
        ]);
        //modification
        text.css({ 'border-radius': '10px' }); // makes text box rounded
        time.replaceWith("<h5 class=\"subtitle is-5\">At <span style=\"font-weight:bold\">" + new Date(time.text().slice(0, -2) + 'GMT-0400').toLocaleString(undefined, { 'hour12': true }) + "</span></h5>"); // changes what the time looks like
        replier.replaceWith("<h4 class=\"title is-4\">" + replier.text() + "</h4>"); // changes the user
        text.before('<hr class="light">'); // adds a header (line)
    }
    var filter = responses.filter(function (v) { return v.isAgent === true; }); // filter out all results which doesn't have isAgent as true
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
var getDataFromBox = function (box) {
    var jquery = $(box); // get jquery static
    var id = jquery.children(':first').children(':first').text();
    var User = jquery.children(':first').text().slice(id.length + 3).split(' ')[0];
    var HasResponded = jquery.children(':first').children('span').get(0) ? true : false; // check if a box exists
    var TicketType = jquery.children(':nth-child(2)').children(':last').text();
    var agent = jquery.children(':nth-child(5)').children(':last').text();
    var Opened = new Date(jquery.children(':nth-child(3)').children(':last').text().slice(0, -2) + 'GMT-0400'); // parses the time 
    var LastUpdated = new Date(jquery.children(':nth-child(4)').children(':last').text().slice(0, -2) + 'GMT-0400'); // to a local format
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
    var _a;
    var _b = $(doc).find('.columns.is-mobile.is-multiline:not([id="C"])').get(), NonOwner = _b[0], Owner = _b[1];
    if (!Owner || !NonOwner)
        return { 'Error': 33, 'Message': 'Expected to have a /tickets document' };
    NonOwner.setAttribute('id', 'NO');
    Owner.setAttribute('id', 'O');
    if (Modify) {
        NonOwner.setAttribute('style', ';justify-content:center');
        Owner.setAttribute('style', ';justify-content:center');
    }
    var Combined = __spreadArrays(Array.from(NonOwner.children), Array.from(Owner.children));
    var claimed = [];
    var OtherBoxes = [];
    for (var key in Combined) {
        var v = Combined[key];
        if (v.nodeName != 'DIV')
            continue;
        var box = getDataFromBox(v.firstElementChild);
        if (box.Agent == GetCurrentAgent())
            claimed = __spreadArrays(claimed, [box]);
        else
            OtherBoxes = __spreadArrays(OtherBoxes, [box]);
        if (Modify) {
            v.setAttribute('id', box.Id);
            //edit styles
            (_a = v.firstElementChild) === null || _a === void 0 ? void 0 : _a.setAttribute('style', 'display: flex;flex-basis: auto;flex-direction: column;');
            box.Element.children[6].setAttribute('style', 'margin-bottom:7px');
            //fix time
            $(box.Element).children(':nth-child(3)').children(':last').text(box.Opened.toLocaleString(undefined, { hour12: true }));
            $(box.Element).children(':nth-child(4)').children(':last').text(box.LastUpdate.toLocaleString(undefined, { hour12: true }));
            //uncap
            v.setAttribute('style', 'width:auto;flex:auto;flex-grow:.1');
            //claim / abandon in background
            // console.log($(box.Element).children('a[href*="claim"], a[href*="abandon"]'))
            $(box.Element).children('a[href*="claim"], a[href*="abandon"]').click(function (ele) {
                //console.log('hi')
                var hrf = $(ele.target).attr('href');
                $(ele.target).removeAttr('href');
                $.get(hrf);
            });
        }
    }
    return { 'Error': null, 'Data': { 'Claimed': claimed, 'Other': OtherBoxes, 'Both': __spreadArrays(claimed, OtherBoxes) } };
}
function GetArrayOfMissingValues(ch, comp) {
    var missing = ch.filter(function (v, i) { return comp.map(function (v2) { return v2 === null || v2 === void 0 ? void 0 : v2.Id; }).indexOf(v === null || v === void 0 ? void 0 : v.Id) == -1; });
    var neww = comp.filter(function (v, i) { return ch.map(function (v2) { return v2 === null || v2 === void 0 ? void 0 : v2.Id; }).indexOf(v === null || v === void 0 ? void 0 : v.Id) == -1; });
    return {
        missing: missing,
        "new": neww
    };
}
function GenerateTicketFromData(data) {
    var creation = $("<div class=\"column is-one-third-desktop is-half-tablet is-fullwidth-mobile\" id=\"" + data.Id + "\" style=\"width:auto;flex:auto;flex-grow:.1\">\n    \n        <div class=\"box\" style=\"display: flex;flex-basis: auto;flex-direction: column;\">\n             \n            <h5 class=\"h5\"><strong>" + data.Id + "</strong> - " + data.User + (data.Responded ? '<span class="tag is-success" style="float: right;">1+ new messages</span>' : '') + "</h5>\n            <h5 class=\"h5\">Ticket Type: <strong>" + SYN.ParseTicketTypeIntoString(data.TicketType) + (data.Agent == GetCurrentAgent() ? ", " + (data.IsOwner ? 'Normal' : 'Owner') : '') + "</strong></h5>\n            <h5 class=\"h5\">Opened: <strong>" + data.Opened.toLocaleString(undefined, { hour12: true }) + "</strong></h5>\n            <h5 class=\"h5\">Last message: <strong>" + data.LastUpdate.toLocaleString(undefined, { hour12: true }) + "</strong></h5>\n            <h5 class=\"h5\">Agent: <strong>" + data.Agent + "</strong></h5><br>\n    \n            <a class=\"button is-info\" href=\"../agent/?id=" + data.Id + "\" style=\"margin-bottom:7px\">View</a>\n            " + (data.Agent == GetCurrentAgent() ?
        "<a class=\"button is-danger\" href=\"../api/abandon.php?id=" + data.Id + "\">Abandon Ticket</a>" :
        data.Agent == 'N/A' ?
            "<a class=\"button is-success\" href=\"../api/claim.php?id=" + data.Id + "\">Claim Ticket</a>" :
            '') + "\n        </div>\n    </div>");
    creation.find('a[href*="claim"], a[href*="abandon"]').click(function (ele) {
        //console.log('hi')
        var hrf = $(ele.target).attr('href');
        $(ele.target).removeAttr('href');
        $.get(hrf);
    });
    return creation;
}
function TICKET_MAIN() {
    var _this = this;
    var _a;
    function refresh(Current) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var b, newDoc, tickets, ticketsv, ticketsC, _i, _g, ticketC, _h, _j, ticket, _k, _l, ticketC, _m, _o, ticket, newdata;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0: return [4 /*yield*/, $.get('')];
                    case 1:
                        b = _p.sent();
                        newDoc = new DOMParser().parseFromString(b, 'text/html');
                        //console.log(newDoc)
                        if (!newDoc)
                            return [2 /*return*/, false];
                        tickets = GetTicketsFromDocument(newDoc, false);
                        if (tickets.Error)
                            console.error(resp.Message); //handle error
                        if (!tickets)
                            window.location.reload(); //caused by getting signed out
                        ticketsv = GetArrayOfMissingValues((_a = Current.Data) === null || _a === void 0 ? void 0 : _a.Other, (_b = tickets.Data) === null || _b === void 0 ? void 0 : _b.Other);
                        ticketsC = GetArrayOfMissingValues((_c = Current.Data) === null || _c === void 0 ? void 0 : _c.Claimed, (_d = tickets.Data) === null || _d === void 0 ? void 0 : _d.Claimed);
                        for (_i = 0, _g = ticketsC["new"]; _i < _g.length; _i++) {
                            ticketC = _g[_i];
                            GenerateTicketFromData(ticketC).appendTo('#C');
                        }
                        for (_h = 0, _j = ticketsv["new"]; _h < _j.length; _h++) {
                            ticket = _j[_h];
                            GenerateTicketFromData(ticket).appendTo("" + (ticket.IsOwner ? '#O' : '#NO'));
                        }
                        for (_k = 0, _l = ticketsC.missing; _k < _l.length; _k++) {
                            ticketC = _l[_k];
                            $('#C').find("[id=" + ticketC.Id + "]").remove();
                        }
                        for (_m = 0, _o = ticketsv.missing; _m < _o.length; _m++) {
                            ticket = _o[_m];
                            $("" + (ticket.IsOwner ? '#O' : '#NO')).find("[id=" + ticket.Id + "]").remove();
                        }
                        newdata = { 'Other': (_e = tickets.Data) === null || _e === void 0 ? void 0 : _e.Other, 'Claimed': (_f = tickets.Data) === null || _f === void 0 ? void 0 : _f.Claimed };
                        StoreData('MainData', newdata);
                        //console.log('Successfully reloaded',ticketsv,ticketsC,newdata)
                        return [2 /*return*/, tickets];
                }
            });
        });
    }
    //contentDiv
    var ContentDiv = $('.content');
    // remove refresh button to replace with settings later. 
    $('#toggleRefreshing').remove();
    //settings 
    var Settings = (_a = GetData('Settings')) !== null && _a !== void 0 ? _a : new SYN.Settings({ UncapTickets: false, CustomFixes: [], AutoRefresh: false });
    var Setb = $('<a><img style="vertical-align: baseline;" src="https://img.icons8.com/ios/30/ffffff/settings.png"/></a>').appendTo(ContentDiv.find('.buttons'));
    var SettingsUIT = false;
    Setb.click(function () {
        SettingsUIT = !SettingsUIT;
        if (SettingsUIT) {
            $('.container').children('h5:first-of-type').before("<div id=\"Settings\" style=\"margin-bottom:1.5rem;\">\n                <h5 class=\"title is-3\" style=\"justify-content:center;display:flex;\">Settings</h5>\n                <hr class=\"thick\">\n                <div class=\"columns is-mobile is-multiline\" style=\"width: 90%;margin-left: auto;margin-right: auto;\" id=\"C\">\n                    <form id = \"SF\" style=\"display:inline\">\n                                        \n                        <input type=\"checkbox\" class=\"S\" name=\"AutoRefresh\" id=\"AR\">\n                        <label for=\"AR\">Auto refresh</label>\n                        <br>\n                        <input type=\"checkbox\" class=\"S\" name=\"UncapTickets\" id=\"UC\">\n                        <label for=\"UC\">Uncap Tickets</label>\n                        <br>\n                        <div id=\"UF\">\n                            <div class = \"UF\" style=\"display:none;\">\n                            \n                                <input class = \"input is-small Name\" type=\"text\" placeholder=\"Name\" style=\"width:10vw\">\n                                <textarea class = \"input is-small Value\" type=\"text\" placeholder=\"Fix\" style=\"width:20vw;margin-bottom:10px;resize:vertical\"></textarea>\n                                <input class = \"button remove\" type = \"button\" value=\"Delete\"style=\"display:none;\">\n                                <input class = \"button add\" type = \"button\" value=\"Add\" style=\"display:none;\">\n                            </div>\n                        </div>\n                    </form>\n                    <br>\n                    <p>You may need to reload the page for some settings to take affect.</p>\n                </div>\n            </div>");
            var c_1 = $('#SF').children('input[type="checkbox"]');
            c_1.prop('checked', function (i, val) {
                var name = $(c_1.get(i)).attr('name');
                return Settings[name];
            });
            c_1.click(function (ele) {
                var name = $(ele.target).attr('name');
                Settings[name] = !Settings[name];
                StoreData('Settings', Settings);
            });
            var deleteF_1 = function (ele) {
                var name = $(ele.target).parent().find('input[class="input is-small Name"]').val();
                var ind = Settings.CustomFixes.filter(function (v) { return v.name == name; })[0];
                if (!ind)
                    return;
                Settings.CustomFixes.splice(Settings.CustomFixes.indexOf(ind), 1);
                StoreData('Settings', Settings);
                $(ele.target).parent().remove();
            };
            for (var _i = 0, _a = Settings.CustomFixes; _i < _a.length; _i++) {
                var fix = _a[_i];
                var newF_1 = $('#UF').children(':first').clone(true, true).appendTo(('#UF'));
                newF_1.css({ 'display': 'block' });
                newF_1.find('input[class="input is-small Name"]').val(fix.name);
                newF_1.find('textarea[class="input is-small Value"]').val(fix.value);
                newF_1.find('input[class="button remove"]').css({ 'display': 'inline', "height": "auto" }).click(deleteF_1);
            }
            var newF_2 = $('#UF').children(':first').clone(true, true).appendTo(('#UF'));
            newF_2.css({ 'display': 'block' });
            newF_2.find('input[class="button add"]').css({ 'display': 'inline', "height": "auto" }).click(function (ele) {
                var n = $(ele.target).parent().clone(true, true).insertBefore(newF_2);
                var name = n.find('input[class="input is-small Name"]').val();
                var value = n.find('textarea[class="input is-small Value"]').val();
                n.find('input[class="button remove"]').css({ 'display': 'inline', "height": "auto" }).click(deleteF_1);
                n.find('input[class="button add"]').css({ 'display': 'none' });
                Settings.CustomFixes = __spreadArrays(Settings.CustomFixes, [new SYN.Fix({ name: name, value: value })]);
                StoreData('Settings', Settings);
                newF_2.find('input[class="input is-small Name"]').val("");
                newF_2.find('textarea[class="input is-small Value"]').val("");
            });
        }
        else
            $('#Settings').remove();
    });
    //uncap
    if (Settings.UncapTickets)
        $('.container').get(0).setAttribute('style', 'max-width: max-content');
    // get tickets from the document
    var resp = GetTicketsFromDocument(document, true); // get the tickets on the current document
    if (resp.Error)
        throw new Error(resp.Message); //handle 
    if (!resp)
        throw new Error('Something went wrong'); // errors
    // get the data from the function
    var _b = [resp.Data.Claimed, resp.Data.Other], claimed = _b[0], OtherBoxes = _b[1];
    { //website modification
        // Claimed & normal tickets
        $("<h5 class=\"title is-5\">Claimed Tickets</h5>\n        <hr>\n        <div class=\"columns is-mobile is-multiline\"style=\";justify-content:center\"id=\"C\"></div>\n        <h5 class=\"title is-5\">Tickets</h5>\n        <hr>").insertBefore('#NO');
        var DivWithClaimedTickets = $('#C');
        //refresh button
        ContentDiv.find('.level-right > .level-item > form').before('<button class="button" style="margin-bottom: auto;margin-right:10px" id="refresh">Refresh</button>').parent()
            .children(':first').click(function () { return __awaiter(_this, void 0, void 0, function () {
            var r, a;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = $('#refresh');
                        r.attr('disabled', 'true');
                        return [4 /*yield*/, refresh(resp)];
                    case 1:
                        a = _a.sent();
                        if (a)
                            resp = a;
                        else
                            return [2 /*return*/, window.location.reload()];
                        r.removeAttr('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        //ticket amounts
        $("<p style=\"margin:auto; padding-left:6px\">\n        Total : " + (OtherBoxes.length + claimed.length) + "\n        </p>\n        <p style=\"margin:auto; padding-left:6px\">\n        Unclaimed : " + OtherBoxes.filter(function (v) { return v.Agent == 'N/A'; }).length + "\n        </p>\n        <p style=\"margin:auto; padding-left:6px\">\n        Claimed : " + (OtherBoxes.filter(function (v) { return v.Agent != 'N/A'; }).length + claimed.length) + " (" + claimed.length + ")\n        </p>").appendTo(ContentDiv.find('.level-left'));
        //fix hr
        $('.container > hr').attr('class', 'thick');
        // make headers look nice
        $('.container > h5').attr('class', 'title is-3');
        $('.container > h5').css({ 'display': 'flex', 'justify-content': "center" });
    }
    // move the claimed tickets to claimed ticket section
    for (var _i = 0, claimed_1 = claimed; _i < claimed_1.length; _i++) {
        var box = claimed_1[_i];
        $(box.Element).children(':nth-child(2)').children(':last').append(", " + (box.IsOwner ? 'Owner' : 'Normal')); // adds the category to type.
        DivWithClaimedTickets.append(box.Element.parentElement); // append to the claimed ticket div
    }
    var olddata = GetData('MainData');
    var newdata = { 'Other': OtherBoxes, 'Claimed': claimed };
    var ClaimedSolved = GetArrayOfMissingValues(newdata.Claimed, olddata.Claimed);
    var NewTickets = GetArrayOfMissingValues(olddata.Other, newdata.Other);
    //console.log(ClaimedSolved,NewTickets);
    StoreData('MainData', newdata); // stores data so it can be compared in the future.
    StoreData('Agent', GetCurrentAgent()); //store current agent so it can be used in /agent
    StoreData('Settings', Settings);
    $('<script id="cl">window.clearInterval(interval); console.log("Removed interval")</script>').appendTo('head'); // remove the interval which is obsolete 
    setTimeout(function () { return $('#cl').remove(); }, 1e2); // remove the script which removes the interval
    $('body > script').remove(); // remove the script which holds the interval because its obsolete since we removed the interval
    $('.content').children(':first').after("<p>Using pozm's tampermonkey script (V2 ~ " + version + ")</p>");
    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
        var a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Settings.AutoRefresh) return [3 /*break*/, 2];
                    return [4 /*yield*/, refresh(resp)];
                case 1:
                    a = _a.sent();
                    if (a)
                        resp = a;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, 14e3);
}
function AGENT_MAIN() {
    var _this = this;
    var _a;
    var reply = GetDataFromAgentDocument(document, true); // get data from the agent page
    var Settings = (_a = GetData('Settings')) !== null && _a !== void 0 ? _a : new SYN.Settings({ UncapTickets: false, CustomFixes: [], AutoRefresh: false });
    //console.log(reply)
    function Confirmation(type) {
        var out = confirm("Are you sure that you want to " + type + " " + (type == 'ban' ? 'this user' : 'this ticket') + "?");
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
    $("<script>" + Confirmation.toString() + "</script>").appendTo('head'); // add the confirmation function
    $('#solve').attr('onclick', 'Confirmation(this.id)'); // redirect solve to confirmation
    $('#ban').attr('onclick', 'Confirmation(this.id)'); // redirect ban to confirmation
    if (reply.Agent == 'N/A' && $('strong[style="color: red;"]').get(0)) {
        $('<div class="control" style="margin-left: auto;"><input type="button" id="Claim" class="button is-link" value="Claim"></div>').appendTo('.field.is-grouped');
        $('#Claim').click(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $.get('https://synapsesupport.io/api/claim.php?id=' + reply.Id)];
                    case 1:
                        _a.sent();
                        window.location.reload();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    //fixes
    var controlbox = $('.box').last();
    var textarea = controlbox.find('textarea');
    if (!textarea.get(0))
        return;
    var fixesbox = $('<div class = "box" style="border-radius: 10px;background-color: #282f2f;display:flex;justify-content:center;align-content:center;flex-flow: wrap;"></div>').insertBefore(controlbox.children(':last'));
    function insertInto(ele) {
        ele = ele.target;
        var name = $(ele).val();
        var pos = textarea.prop("selectionStart");
        var currText = textarea.text();
        var textBefore = currText.substring(0, pos);
        var textAfter = currText.substring(pos, currText.length);
        var val = Settings.CustomFixes.filter(function (v) { return v.name == name; })[0].value;
        val = val.replace('%user%', reply.User);
        val = val.replace('%agent%', GetData('Agent'));
        var sel = val.indexOf('%mouse%') != -1 ? val.indexOf('%mouse%') : (textBefore + val).length;
        val = val.replace('%mouse%', '');
        //console.log(val)
        textarea.text(textBefore + val + textAfter);
        textarea.focus();
        textarea.prop("selectionStart", sel);
        textarea.prop("selectionEnd", sel);
    }
    //console.log('hi')
    for (var _i = 0, _b = Settings.CustomFixes; _i < _b.length; _i++) {
        var fix = _b[_i];
        //console.log(fix)
        $('<input type="button" class = "button" style="margin-right:10px">').appendTo(fixesbox).val(fix.name).click(insertInto);
    }
}
window.onload = (function () {
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
