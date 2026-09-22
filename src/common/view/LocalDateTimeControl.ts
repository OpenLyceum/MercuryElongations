import { NumberProperty, Property, type TReadOnlyProperty } from "scenerystack/axon";
import { Range } from "scenerystack/dot";
import { GridBox } from "scenerystack/scenery";
import { NumberControl, PhetFont } from "scenerystack/scenery-phet";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import {
  CIVIL_DAY_RANGE,
  CIVIL_HOUR_RANGE,
  CIVIL_MINUTE_RANGE,
  CIVIL_MONTH_RANGE,
  CIVIL_YEAR_RANGE,
  CONTROL_FONT_SIZE,
} from "../../MercuryElongationsConstants.js";
import { civilTimeToLocalParts, daysInMonth, localPartsToCivilTime } from "../astronomy/dateTime.js";
import { COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS } from "../MercuryElongationsControlOptions.js";
import type { MercurySystemModel } from "../model/MercurySystemModel.js";

export class LocalDateTimeControl extends GridBox {
  public constructor(model: MercurySystemModel) {
    const controls = StringManager.getInstance().getControls();
    const a11y = StringManager.getInstance().getCommonA11yStrings().controls;
    const initial = civilTimeToLocalParts(model.civilTimeMsProperty.value);
    const yearProperty = new NumberProperty(initial.year, { range: CIVIL_YEAR_RANGE });
    const monthProperty = new NumberProperty(initial.month, { range: CIVIL_MONTH_RANGE });
    const dayProperty = new NumberProperty(initial.day, { range: CIVIL_DAY_RANGE });
    const hourProperty = new NumberProperty(initial.hour, { range: CIVIL_HOUR_RANGE });
    const minuteProperty = new NumberProperty(initial.minute, { range: CIVIL_MINUTE_RANGE });
    const dayRangeProperty = new Property(new Range(1, daysInMonth(initial.year, initial.month)));

    let syncingFromModel = false;
    let syncingToModel = false;
    const pushToModel = (): void => {
      if (syncingFromModel) {
        return;
      }
      syncingToModel = true;
      model.setCivilTimeAndPause(
        localPartsToCivilTime({
          year: yearProperty.value,
          month: monthProperty.value,
          day: dayProperty.value,
          hour: hourProperty.value,
          minute: minuteProperty.value,
        }),
      );
      syncingToModel = false;
    };
    const updateDayRange = (): void => {
      const maxDay = daysInMonth(yearProperty.value, monthProperty.value);
      dayRangeProperty.value = new Range(1, maxDay);
      if (dayProperty.value > maxDay) {
        dayProperty.value = maxDay;
      }
    };

    yearProperty.lazyLink(() => {
      updateDayRange();
      pushToModel();
    });
    monthProperty.lazyLink(() => {
      updateDayRange();
      pushToModel();
    });
    dayProperty.lazyLink(pushToModel);
    hourProperty.lazyLink(pushToModel);
    minuteProperty.lazyLink(pushToModel);

    model.civilTimeMsProperty.link((civilTimeMs) => {
      if (syncingToModel) {
        return;
      }
      syncingFromModel = true;
      const parts = civilTimeToLocalParts(civilTimeMs);
      yearProperty.value = parts.year;
      monthProperty.value = parts.month;
      dayProperty.value = parts.day;
      hourProperty.value = parts.hour;
      minuteProperty.value = parts.minute;
      dayRangeProperty.value = new Range(1, daysInMonth(parts.year, parts.month));
      syncingFromModel = false;
    });

    const spinner = (
      titleProperty: TReadOnlyProperty<string>,
      numberProperty: NumberProperty,
      range: Range,
      accessibleName: TReadOnlyProperty<string>,
      enabledRangeProperty?: Property<Range>,
    ): NumberControl =>
      new NumberControl(titleProperty, numberProperty, range, {
        ...COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS,
        delta: 1,
        numberDisplayOptions: { decimalPlaces: 0, maxWidth: 44 },
        titleNodeOptions: {
          font: new PhetFont(CONTROL_FONT_SIZE),
          fill: MercuryElongationsColors.textColorProperty,
          maxWidth: 46,
        },
        accessibleName,
        ...(enabledRangeProperty ? { enabledRangeProperty } : {}),
      });

    super({
      rows: [
        [spinner(controls.yearStringProperty, yearProperty, CIVIL_YEAR_RANGE, a11y.yearStringProperty)],
        [spinner(controls.monthStringProperty, monthProperty, CIVIL_MONTH_RANGE, a11y.monthStringProperty)],
        [spinner(controls.dayStringProperty, dayProperty, CIVIL_DAY_RANGE, a11y.dayStringProperty, dayRangeProperty)],
        [spinner(controls.hourStringProperty, hourProperty, CIVIL_HOUR_RANGE, a11y.hourStringProperty)],
        [spinner(controls.minuteStringProperty, minuteProperty, CIVIL_MINUTE_RANGE, a11y.minuteStringProperty)],
      ],
      ySpacing: 4,
      xAlign: "left",
    });
  }
}
