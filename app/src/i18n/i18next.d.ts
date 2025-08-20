import "i18next";
import type en from "./locales/en.json";
import type fi from "./locales/fi.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "en";
    enableSelector: true;
    resources: {
      en: typeof en;
      fi: typeof fi;
    };
  }
}
