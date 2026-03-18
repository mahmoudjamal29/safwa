"use client";

import { createFormHook } from "@tanstack/react-form";

import { AutocompleteGrouped } from "./AutocompleteGrouped-field";
import { Button, ButtonGroup } from "./button-field";
import { ButtonSelector } from "./button-selector-field";
import { Card } from "./card-field";
import { Checkbox } from "./checkbox-field";
import { CheckboxGroup } from "./checkbox-group-field";
import { Combobox } from "./combobox-field";
import { DateInput } from "./date-input-field";
import { DatePicker } from "./date-picker-field";
import { DateRangePicker } from "./date-range-picker-field";
import { DateRangeTimePicker } from "./date-range-time-picker-field";
import { DateTimeInput } from "./date-time-input-field";
import { DateTimePicker } from "./date-time-picker-field";
import { DaysOfWeekSelector } from "./days-of-week-selector-field";
import { fieldContext, formContext } from "./form-contexts";
import { Input } from "./input-field";
import { Password } from "./password-field";
import { QuantityControl } from "./quantity-control-field";
import { RadioButton } from "./radio-button-field";
import { Select } from "./select-field";
import { SubmitButton } from "./submit-button-field";
import { Switch } from "./switch-field";
import { TextArea } from "./text-area-field";
import { TimePicker } from "./time-picker-field";

export {
  fieldContext as FieldContext,
  useFieldContext,
  useFormContext,
} from "./form-contexts";
export { FormField } from "./form-field";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldComponents: {
    AutocompleteGrouped,
    Button,
    ButtonGroup,
    ButtonSelector,
    Card,
    Checkbox,
    CheckboxGroup,
    Combobox,
    DateInput,
    DatePicker,
    DateRangePicker,
    DateRangeTimePicker,
    DateTimeInput,
    DateTimePicker,
    DaysOfWeekSelector,
    Input,
    Password,
    QuantityControl,
    RadioButton,
    Select,
    Switch,
    TextArea,
    TimePicker,
  },
  fieldContext,
  formComponents: {
    SubmitButton,
  },
  formContext,
});
