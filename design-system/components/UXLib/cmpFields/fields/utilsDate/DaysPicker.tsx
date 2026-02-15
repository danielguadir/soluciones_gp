"use client";
import React, { ChangeEventHandler, useEffect, useState } from 'react'
import { DayPicker, DateRange } from "react-day-picker";
import { format, isValid, parse, setHours, setMinutes } from "date-fns";
import { dateToLong } from '../../utils';
const RANGE = 'range'

const DaysPicker = ({
  modeSelectDate,
  setDateCalendar,    // single || range
  numOfMonth,
  startMonth,
  endMonth,
  pickerDate = (date) => { },

  //styles
}) => {

  useEffect(() => {
    const y = setDateCalendar;
    handleDayPickerSelect(y)

  }, [])

  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = useState(new Date());
  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });

  // Hold the input value in state
  const [inputValue, setInputValue] = useState("");

  // De Date a long (timestamp)


  const handleDayPickerSelect = (date) => {
    if (date !== '') {
      pickerDate(date)
      date = new Date(date)

      setSelectedDate(date);
      setMonth(date);
      setInputValue(format(date, "dd/MMMM/yyyy"));

    } else {

    }
    /* if (date === '') {
       date = new Date()
     }*/

  };

  const handleRangeSelect = (selectedRange) => {
    setRange(selectedRange);
  };
  /*
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value); // Keep the input value in sync
  
      const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());
  
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
        setMonth(parsedDate);
      } else {
        setSelectedDate(undefined);
      }
    };
    */
  return (
    <>
      <DayPicker
        captionLayout="dropdown"
        defaultMonth={new Date(2024, 6)}
        startMonth={startMonth}
        endMonth={endMonth}
        navLayout='after'
        numberOfMonths={numOfMonth}
        month={month}
        onMonthChange={setMonth}
        mode={modeSelectDate}
        selected={modeSelectDate === RANGE ? range : selectedDate}
        onSelect={modeSelectDate === RANGE ? handleRangeSelect : handleDayPickerSelect}
      //   footer={`Fecha: ${selectedDate?.toDateString()}`}
      />
      {
        range?.from && (
          <div>
            <p>Fecha de inicio: {range?.from.toLocaleDateString()}</p>
            {range?.to && (
              <p>Fecha de fin: {range?.to.toLocaleDateString()}</p>
            )}
          </div>
        )
      }
      {
        modeSelectDate !== RANGE && `Fecha: ${selectedDate?.toDateString()}`
      }
    </>


  )
}

export { DaysPicker }