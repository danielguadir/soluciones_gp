"use client";
import React, { useEffect, useState } from 'react';
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";

const RANGE = 'range';

type DayInputValue = Date | string | number | null | undefined;

interface DaysPickerProps {
  modeSelectDate?: "single" | "range";
  setDateCalendar?: DayInputValue;
  numOfMonth?: number;
  startMonth?: Date;
  endMonth?: Date;
  pickerDate?: (date: DayInputValue) => void;
}

const DaysPicker: React.FC<DaysPickerProps> = ({
  modeSelectDate,
  setDateCalendar,
  numOfMonth,
  startMonth,
  endMonth,
  pickerDate = () => { },
}) => {
  useEffect(() => {
    if (setDateCalendar !== undefined && setDateCalendar !== null && setDateCalendar !== "") {
      handleDayPickerSelect(setDateCalendar);
    }
  }, [setDateCalendar]);

  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const handleDayPickerSelect = (date: DayInputValue) => {
    if (date === undefined || date === null || date === "") {
      return;
    }

    const parsedDate = typeof date === "number" ? new Date(date) : date instanceof Date ? date : new Date(date);

    pickerDate(parsedDate);
    setSelectedDate(parsedDate);
    setMonth(parsedDate);
    setInputValue(format(parsedDate, "dd/MMMM/yyyy"));
  };

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  };

  const [inputValue, setInputValue] = useState("");
  const pickerMode: "range" | "single" = modeSelectDate === RANGE ? "range" : "single";

  const dayPickerProps = {
    captionLayout: "dropdown" as const,
    defaultMonth: new Date(2024, 6),
    startMonth,
    endMonth,
    navLayout: 'after' as const,
    numberOfMonths: numOfMonth,
    month,
    onMonthChange: setMonth,
    mode: pickerMode,
    selected: modeSelectDate === RANGE ? range : selectedDate,
    required: false,
    onSelect: modeSelectDate === RANGE ? handleRangeSelect : (value: Date | DateRange | undefined) => handleDayPickerSelect(value as Date | number | string | null | undefined),
  };

  return (
    <>
      <DayPicker {...dayPickerProps as any} />
      {range?.from && (
        <div>
          <p>Fecha de inicio: {range?.from.toLocaleDateString()}</p>
          {range?.to && <p>Fecha de fin: {range?.to.toLocaleDateString()}</p>}
        </div>
      )}
      {modeSelectDate !== RANGE && `Fecha: ${selectedDate?.toDateString()}`}
    </>
  );
};

export { DaysPicker };