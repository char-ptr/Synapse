const fs = require('fs');
const readline = require('readline');

const GenerateFix = async (Issue, causedBy, SFFix, IFix , type) => {
    const fixes = await fs.readFileSync('./SyanpseFixes.json','utf-8')
    const Parsed = JSON.parse(fixes)


    const rl = readline.createInterface(

        process.stdin,
        process.stdout
    
    )


    let fix = { 'CausedBy' : causedBy, 'SupportFriendlyFix': SFFix, 'InstructionalFix' : IFix, 'Last Update' : Date.now(), 'TypeOfFix':type}

    return new Promise((resolve=>{

        rl.question(`Should i save \n`+JSON.stringify(fix,null,4)+`?\n\ny / n\n`, (aws) => {

            if (aws != 'y') return rl.close();

            Parsed.Fixes[Issue] = fix;
            let ReStringified = JSON.stringify(Parsed,null,4);
            
            fs.writeFileSync('./SyanpseFixes.json',ReStringified);
            console.log('Done.')
            rl.close();
            resolve('')

        })
    }))
}



// checking status
(async()=>{
await GenerateFix(
    
    // issue
    `Stuck at "Checking status"`, 


    // caused by
    `one or more of 4 things, These four things conclude:
    having an antivirus blocking synapse from execution properly, ISP preventing synapse from connecting to its servers, Out dated windows as it can not include some needed libaries. And last due to having a faulty installiation of Synapse X.`,

    // support friendly fix
    `Before trying any fixes it's recommended to delete the synapse folder and then reinstall it, heres a video to help you install synapse properly if you're not sure. https://youtu.be/FF3xK087USQ
    
Could you check if you have any antivirus enabled? If so could you please uninstall them as they will most likely interfere with synapse working, Before saying that you already know that they're disabled please confirm by checking in control panel. 
You can access control panel by pressing win + r then typing "appwiz.cpl" This will show all currently installed programs, if you're not sure if you have any please send screenshots showing the whole panel. (You must upload to a image hosting site (e.g. imgur) then paste it in a reply).


After you have confirmed that you have no antiviruses still enabled could you try downloading and installing protonvpn (https://protonvpn.com/download), This is a free vpn which you can use. This step is neccessary incase your isp is blocking the connection between SynapseX and it's servers.

If That step also didn't work could you check your windows version? And check that its updated To be safe you can use this tool made by microsoft to download the most recent update. https://www.microsoft.com/en-gb/software-download/windows10`,


    // Instructional Fix
    `Fix 1: Turn your antivirus off or uninstall it. If it's an antivirus such as McAfee, uninstall it as it will continue to cause issues even when "disabled". 

Fix 2: Delete the bin folder and run as an administrator.
    
Fix 3: Use ProtonVPN then try injecting. (Proton is highly recommended as other VPN's may not work as well)
    
Fix 4: Reboot router (Last Resort).
    
Fix 5: Make sure windows 10 is updated.`,

    // type of fix
    'ACTUAL' 

)


await GenerateFix(

    'Failed to download bootstrapper',

    'Either \n1. Bad installation of synapse X\n2. Antivirus interfering\n3. Isp interfering',

    `Before trying any fixes it's recommended to delete the synapse folder and then reinstall it, heres a video to help you install synapse properly if you're not sure. https://youtu.be/FF3xK087USQ
    
    Could you check if you have any antivirus enabled? If so could you please uninstall them as they will most likely interfere with synapse working, Before saying that you already know that they're disabled please confirm by checking in control panel. 
    You can access control panel by pressing win + r then typing "appwiz.cpl" This will show all currently installed programs, if you're not sure if you have any please send screenshots showing the whole panel. (You must upload to a image hosting site (e.g. imgur) then paste it in a reply).
    
    
    After you have confirmed that you have no antiviruses still enabled could you try downloading and installing protonvpn (https://protonvpn.com/download), This is a free vpn which you can use. This step is neccessary incase your isp is blocking the connection between SynapseX and it's servers.`,

    `Fix 1: Ensure there is no antivirus interfering with the installation of Synapse. Uninstall/Disable any and all antivirus software including real time protection within windows defender.

Fix 2: Have the user use ProtonVPN and then run synapse, this resolved 99% of errors of this nature

Fix 3: Sometimes a user does not install Synapse correctly which can lead to such errors. Have the user install synapse from scratch, step by step, guiding them as needed. Remember to be patient with them. Use the #installing-synapse channel for a guide with images provided

Fix 4: Make sure the users operating system is up to date`,

    'ACTUAL'


)

/* 
await GenerateFix(

    'Discord invite',

    'Synapse x not auto inviting to the discord.',

    'Could you join this server and contact one of the staff asking for an invite, make sure to give your synapse username. https://discord.gg/NzWWzUF',

    'Get the user to join the purchase website and contact you. and then follow the default procedure',

    'ACTUAL'
)
 */

/* await GenerateFix(

    'C2-2',
    'Malware infecting discord.',

    'Could you press windows key + r then type "%appdata%, once done hit enter and look for a folder named "Discord", open the folder and then go to a folder named "0.0.306" and then go into "Modules" and finally "discord_desktop_core", once you have done that open index.js and make sure it ONLY says "module.exports = require(\'./core.asar\');",\nIf you don\'t understand then you can watch this video.  https://youtu.be/hj1wl1HARW4',
    'Get the user to confirm there is nothing suspicious inside %appdata%/Discord/0.0.306/Modules/discord_desktop_core/index.js.',
    'ACTUAL'

) */

await GenerateFix(

    'Black box',
    'Missing VC Redist libaries.',
    `Could you download and install vc redist. You will need both x64 and x86, You can find the download for both of them here:\nhttps://aka.ms/vs/16/release/vc_redist.x86.exe\nhttps://aka.ms/vs/16/release/vc_redist.x64.exe\n\nOnce you've installed both of them reboot your pc.\n\nAfter rebooting delete bin and run synapse x.exe as admin`,
    'Get the user to download VC redist from https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads .',
    'ACTUAL'

)

/* await GenerateFix(

    'User account',
    'NA',
    'Could you create a new windows user account which is an admin, you can find a guide on how to do that here:\nhttps://support.microsoft.com/en-gb/help/4026923/windows-10-create-a-local-user-or-administrator-account',
    'Get the user to create a new windows account and install synapse on it.',
    'PARIAL'

) */

/* await GenerateFix(

    'Injection crash',
    'Antivirus blocking synapse, or messed up windows account',
    `Before trying any fixes it's recommended to delete the synapse folder and then reinstall it, heres a video to help you install synapse properly if you're not sure. https://youtu.be/FF3xK087USQ
    
    Could you check if you have any antivirus enabled? If so could you please uninstall them as they will most likely interfere with synapse working, Before saying that you already know that they're disabled please confirm by checking in control panel. 
    You can access control panel by pressing win + r then typing "appwiz.cpl" This will show all currently installed programs, if you're not sure if you have any please send screenshots showing the whole panel. (You must upload to a image hosting site (e.g. imgur) then paste it in a reply).`,
    'Have the user confirm that all antiviruses aren\'t preventing synapse from working',
    'ACTUAL'

) */

/* await GenerateFix(
    
    'Inactive',
    'NA',
    `This ticket has been closed due to inactivity. Feel free to create another ticket with the same question if your issue wasn't resolved.`,
    'NA',
    'EXT'
    
) */


await GenerateFix(

    'Javascript Error',
    'faulty install of synapse X or messed up windows account, or ISP issues',
`Before trying any fixes it's recommended to delete the synapse folder and then reinstall it, heres a video to help you install synapse properly if you're not sure. https://youtu.be/FF3xK087USQ

After you have confirmed that you have no antiviruses still enabled could you try downloading and installing protonvpn (https://protonvpn.com/download), This is a free vpn which you can use. This step is necessary incase your isp is blocking the connection between SynapseX and it's servers.
    
If neither fix worked could you create a new windows user account which is an admin, you can find a guide on how to do that here:\nhttps://support.microsoft.com/en-gb/help/4026923/windows-10-create-a-local-user-or-administrator-account
    `,

    `Fix 1. Have the buyer reinstall synapse x. 
Fix 2. Have the buyer download and use proton vpn.
Fix 3. Have the buyer create a new windows user account.
    `,
    'ACTUAL'

)



await GenerateFix(

    'Injection stuck',
    `one or more of 4 things, These four things conclude:
    having an antivirus blocking synapse from execution properly, ISP preventing synapse from connecting to its servers, Out dated windows as it can not include some needed libaries. And last due to having a faulty installiation of Synapse X.`,
    `Before trying any fixes it's recommended to delete the synapse folder and then reinstall it, heres a video to help you install synapse properly if you're not sure. https://youtu.be/FF3xK087USQ

Could you check if you have any antivirus enabled? If so could you please uninstall them as they will most likely interfere with synapse working, Before saying that you already know that they're disabled please confirm by checking in control panel.
You can access control panel by pressing win + r then typing "appwiz.cpl" This will show all currently installed programs, if you're not sure if you have any please send screenshots showing the whole panel. (You must upload to a image hosting site (e.g. imgur) then paste it in a reply).

After you have confirmed that you have no antiviruses still enabled could you try downloading and installing protonvpn (https://protonvpn.com/download), This is a free vpn which you can use. This step is necessary incase your isp is blocking the connection between SynapseX and it's servers.
    `,

    `Fix 1: Ensure there is no antivirus interfering with the installation of Synapse. Uninstall/Disable any and all antivirus software including real time protection within windows defender.

Fix 2: Have the user use ProtonVPN and then run synapse, this resolved 99% of errors of this nature

Fix 3: Sometimes a user does not install Synapse correctly which can lead to such errors. Have the user install synapse from scratch, step by step, guiding them as needed. Remember to be patient with them. Use the #installing-synapse channel for a guide with images provided
    `,

    'ACTUAL'


)
})()