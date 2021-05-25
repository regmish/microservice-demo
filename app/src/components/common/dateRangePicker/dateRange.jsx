import React, {useState, useEffect} from 'react'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

import { IconButton, Typography } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

export const DateRangePickerComponent = ({label, date, setDate}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [show, setShow] = useState(false);
    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);
    
      useEffect(() => {
       if (date){
            setState([
                {
                    startDate: new Date(date.startDate),
                    endDate: new Date(date.endDate),
                    key: 'selection'
                }
            ]);
            setStartDate(new Date(date.startDate).toDateString())
            setEndDate(new Date(date.endDate).toDateString())
        }
    }, [date])

    const toggleDateRange = () => {
        setShow(!show)
    }
    const handleDateChange = (item) => {
        setState([item.selection])
        setDate({
            startDate: item.selection.startDate,
            endDate: item.selection.endDate
        })
        setStartDate(item.selection.startDate.toDateString())
        setEndDate(item.selection.endDate.toDateString())
    }
    const cleanDate = () => {
        setShow(false);
        setStartDate('');
        setEndDate('');
        setDate(null);
        setState([
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
          ])
    }
return (
    <div>
        <Typography>{label}</Typography>
        <IconButton color="primary" aria-label={label} onClick={toggleDateRange}>
            <DateRangeIcon />
        </IconButton>
        { show &&  <DateRange 
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={state}
            />}
        {
            !show && (
                <>
                    {startDate} - {endDate}
                    <IconButton 
                        size="small" 
                        aria-label="clear Date" 
                        onClick={cleanDate}>
                        <HighlightOffIcon size="small"/>
                    </IconButton>
                </>
            )
        }
    </div>
) 
}