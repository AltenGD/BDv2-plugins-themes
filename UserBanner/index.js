let image;
const request = require('request');
const mainUrl = "https://userbannerserver2.herokuapp.com";

exports.main = (Plugin, { CssUtils, Logger, Settings, Modals, BdMenu: { BdMenuItems }, CommonComponents, DiscordContextMenu, Autocomplete, Notifications, Api, DiscordApi }) => class UserBanner extends Plugin {
    async onStart()
    {
        const set = Settings.createSet({
            text: this.name
        })

        const category = await set.addCategory({ id: 'default' })

        const imageSetting = await category.addSetting({
            id: 'Image',
            type: 'text',
            text: 'URL for image'
        })

        imageSetting.on('setting-updated', event => 
        {
            //Regex checking
            if (event.value.match(/\.(jpeg|jpg|gif|png)$/) && event.value.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/))
            {
                let discordID = DiscordApi.currentUser.id;
    
                Notifications.add(`Image changed to: ${event.value}`, [
                    {text: 'View Profile', onClick: () => { DiscordApi.currentUser.openUserProfileModal(); return true; }},
                    {text: 'Dismiss', onClick: () => true}
                ])

                image = event.value;

                let CSS = `.theme-dark .topSectionNormal-2-vo2m {
                    background-color: transparent;
                }`

                CssUtils.injectSass(CSS);

                let ServerAPI = require('./Components/ServerAPI');
                let API = new ServerAPI();
                API.UploadImage(image, discordID)

                request.get({
                    url: `${mainUrl}/image`
                }, (e, r, b) => {
                    Logger.log(b)
                    CssUtils.injectSass(b);
                })
            }
        })

        request.get({
            url: `${mainUrl}/image`
        }, (e, r, b) => {
            Logger.log(b)
            CssUtils.injectSass(b);
        })

        this.menuItem = BdMenuItems.addSettingsSet('Plugins', set, 'User Banner')

        return true;
    }

    onstop() 
    {
        BdMenuItems.removeAll();
        DiscordContextMenu.removeAll();
        Autocomplete.removeAll();

        let CSS = `.theme-dark .topSectionNormal-2-vo2m {
            background-color: #202225;
        }`

        CssUtils.injectSass(CSS);
    }
}