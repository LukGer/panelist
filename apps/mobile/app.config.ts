import { IOSIcons } from "@expo/config-types";
import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "dev";
const IS_PREVIEW = process.env.APP_VARIANT === "pre";

const getAppName = () => {
  if (IS_DEV) {
    return "Panelist - DEV";
  }

  if (IS_PREVIEW) {
    return "Panelist - PRE";
  }

  return "Panelist";
};

const getUniqueBundleId = () => {
  if (IS_DEV) {
    return "dev.lukger.panelist.dev";
  }

  if (IS_PREVIEW) {
    return "dev.lukger.panelist.pre";
  }

  return "dev.lukger.panelist";
};

const getAppScheme = () => {
  if (IS_DEV) {
    return "panelist-dev";
  }

  if (IS_PREVIEW) {
    return "panelist-pre";
  }

  return "panelist-app";
};

const getAppIcons = (): IOSIcons => {
  if (IS_DEV) {
    return {
      dark: "./assets/icons/dev/ios-dark.png",
      light: "./assets/icons/dev/ios-light.png",
      tinted: "./assets/icons/dev/ios-tinted.png",
    };
  }

  if (IS_PREVIEW) {
    return {
      dark: "./assets/icons/pre/ios-dark.png",
      light: "./assets/icons/pre/ios-light.png",
      tinted: "./assets/icons/pre/ios-tinted.png",
    };
  }

  return {
    dark: "./assets/icons/ios-dark.png",
    light: "./assets/icons/ios-light.png",
    tinted: "./assets/icons/ios-tinted.png",
  };
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: getAppName(),
  slug: "panelist",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: getAppScheme(),
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueBundleId(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: getAppIcons(),
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-web-browser",
    "expo-secure-store",
    "expo-font",
    "expo-sqlite",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "b4ab1d7a-726b-4b76-a11d-df5cb1fa67e8",
    },
  },
});
