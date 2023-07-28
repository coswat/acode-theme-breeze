import plugin from "../plugin.json";
import tag from "html-tag-js";
const style = require("./style.scss");
const appSettings = acode.require("settings");
const themes = acode.require("themes");
const ThemeBuilder = acode.require("themeBuilder");
const toast = acode.require("toast");

interface PromptOption {
    required: boolean;
}

interface SettingsListItem {
    key: string;
    text: string;
    value: string;
    info: string;
    prompt: string;
    promptType: string;
    promptOption: PromptOption[];
}

type SettingsList = {
    list: SettingsListItem[];
    cb: (key: string, value: string) => void;
};

class Breeze {
    // Base Url
    public baseUrl: string | undefined;
    // Style Element
    private style!: HTMLStyleElement;
    // default dodge color
    public dodgeColor: string = "#3399ff";

    // apply the default settings
    constructor() {
        if (!appSettings.value[plugin.id]) {
            appSettings.value[plugin.id] = {
                dodgeColor: this.dodgeColor,
            };
            appSettings.update(false);
        }
    }
    // plugin initialization
    public async init(): Promise<void> {
        // Creating style Element
        this.style = tag("style", {
            textContent: style.default,
        });
        // Append the style to the head
        document.head.append(this.style);
        // add the theme
        this.themeBreeze("Theme Breeze");
    }

    public async destroy(): Promise<void> {
        // clean ups
    }

    public async themeBreeze(name: string): Promise<void> {
        const breeze: typeof ThemeBuilder = new ThemeBuilder(
            name,
            "dark",
            "free"
        );
        // core theme properties
        breeze.primaryColor = "#151515";
        breeze.popupBackgroundColor = "#191919";
        breeze.darkenedPrimaryColor = "#131313";
        breeze.primaryTextColor = "#ffffff";
        breeze.secondaryColor = "#202020";
        breeze.secondaryTextColor = "#ffffff";
        breeze.activeColor = this.settings.dodgeColor;
        breeze.activeIconColor = this.settings.dodgeColor;
        breeze.linkTextColor = "#7cbcfb";
        breeze.errorTextColor = "#f97583";
        breeze.scrollbarColor = "#30363d";
        breeze.borderColor = "#30363d";
        breeze.popupBorderColor = "#30363d";
        breeze.borderRadius = "4px";
        breeze.popupBorderRadius = "4px";
        breeze.popupIconColor = "#ffffff";
        breeze.popupTextColor = "#ffffff";
        breeze.popupActiveColor = "gold";
        breeze.boxShadowColor = "#00000033";
        breeze.buttonActiveColor = this.settings.dodgeColor;
        breeze.buttonBackgroundColor = this.settings.dodgeColor;
        breeze.buttonTextColor = "#ffffff";

        themes.add(breeze);
        themes.apply(name);
    }
    // get settings list
    public get settingsList(): SettingsList {
        return {
            list: [
                {
                    key: "dodgeColor",
                    text: "Dodge Color",
                    value: this.settings.dodgeColor,
                    info: "The main dodge color",
                    prompt: "Enter color ( rgb or hex )",
                    promptType: "text",
                    promptOption: [
                        {
                            required: true,
                        },
                    ],
                },
            ],
            cb: (key: string, value: string) => {
                this.settings[key] = value;
                appSettings.update(false);
                appSettings.on("update", () => {
                    toast("Restart the app", 3000);
                });
            },
        };
    }
    // get plugin settings value from settings.json
    public get settings(): any {
        return appSettings.value[plugin.id];
    }
}
if (window.acode) {
    const _theme = new Breeze();
    acode.setPluginInit(
        plugin.id,
        async (
            baseUrl: string,
            $page: WCPage,
            { cacheFileUrl, cacheFile }: any
        ) => {
            if (!baseUrl.endsWith("/")) {
                baseUrl += "/";
            }
            _theme.baseUrl = baseUrl;
            await _theme.init();
        },
        _theme.settingsList
    );
    acode.setPluginUnmount(plugin.id, () => {
        _theme.destroy();
    });
}
