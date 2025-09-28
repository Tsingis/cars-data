import "i18next";
import type en from "./locales/en.json";
import type fi from "./locales/fi.json";

declare module "i18next" {
  interface CustomTypeOptions {
    enableSelector: true;
    defaultNS: "en";
    resources: {
      en: typeof en;
      fi: typeof fi;
    };
  }
}
