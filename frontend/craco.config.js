const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "primary-color": "#3bb2ac",
          "@layout-header-background": "#1E2429",
          "@error-color": "#dc143c",
          "@menu-dark-submenu-bg": "#0e161a",
          "@text-color": "#5a6270",
          "@border-radius-base": "2px",
          "@layout-trigger-background": "fff",
          "@layout-trigger-color": "@primary-color",
        },
      },
    },
  ],
};
