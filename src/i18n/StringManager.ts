import type { ReadOnlyProperty } from "scenerystack/axon";
import { LocalizedString } from "scenerystack/chipper";
import stringsEn from "./strings_en.json";
import stringsEs from "./strings_es.json";
import stringsFr from "./strings_fr.json";

// biome-ignore lint/complexity/noVoid: compile-time locale parity
void (stringsFr satisfies typeof stringsEn);
// biome-ignore lint/complexity/noVoid: compile-time locale parity
void (stringsEn satisfies typeof stringsFr);
// biome-ignore lint/complexity/noVoid: compile-time locale parity
void (stringsEs satisfies typeof stringsEn);
// biome-ignore lint/complexity/noVoid: compile-time locale parity
void (stringsEn satisfies typeof stringsEs);

const stringProperties = LocalizedString.getNestedStringProperties({ en: stringsEn, es: stringsEs, fr: stringsFr });

export class StringManager {
  private static instance: StringManager | null = null;

  private constructor() {}

  public static getInstance(): StringManager {
    StringManager.instance ??= new StringManager();
    return StringManager.instance;
  }

  public getTitleStringProperty(): ReadOnlyProperty<string> {
    return stringProperties.titleStringProperty;
  }

  public getScreenNames() {
    return stringProperties.screens;
  }

  public getLabels() {
    return stringProperties.labels;
  }

  public getLocations() {
    return stringProperties.locations;
  }

  public getEvents() {
    return stringProperties.events;
  }

  public getControls() {
    return stringProperties.controls;
  }

  public getPatterns() {
    return stringProperties.patterns;
  }

  public getCommonA11yStrings() {
    return stringProperties.a11y.common;
  }

  public getPlanetariumA11yStrings() {
    return stringProperties.a11y.planetarium;
  }

  public getOrbitsA11yStrings() {
    return stringProperties.a11y.orbits;
  }
}
