import plugin from "../plugin.json";
import style from "./style.scss";
const appSettings = acode.require("settings");
const themes = acode.require("themes");
const ThemeBuilder = acode.require("themeBuilder");

class Breeze {
  // default dodge color
  dodgeColor = "#3399ff";

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
  async init() {
    this.style = <style textContent={style}></style>;
    document.head.append(this.style);
    // add the theme
    this.themeBreeze("Theme Breeze");
  }

  async destroy() {
    // clean ups
  }

  async themeBreeze(name) {
    const breeze = new ThemeBuilder(name, "dark", "free");
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
  get settingsList() {
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
      cb: (key, value) => {
        this.settings[key] = value;
        appSettings.update(false);
        appSettings.on("update", (v) => {
          window.toast("Restart the app");
        });
      },
    };
  }
  // get plugin settings value from settings.json
  get settings() {
    return appSettings.value[plugin.id];
  }
}
if (window.acode) {
  const _theme = new Breeze();
  acode.setPluginInit(
    plugin.id,
    (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      _theme.baseUrl = baseUrl;
      _theme.init($page, cacheFile, cacheFileUrl);
    },
    _theme.settingsList
  );
  acode.setPluginUnmount(plugin.id, () => {
    _theme.destroy();
  });
}
