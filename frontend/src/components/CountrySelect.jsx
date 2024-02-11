import React from 'react'
import {Autocomplete, Grid, TextField, Skeleton} from '@mui/material'
import useAxios from "../hooks/useAxios"

const CountrySelect = (props)  => {
    const {value, setValue, label} = props;
    const[data, loaded, error] = useAxios("https://restcountries.com/v3.1/all");

    if(loaded){
        return(
            <Grid item xs={12} md={3}>
                <Skeleton variant="rounded" height={60}/>
            </Grid>
        )
    }

    if(error){
        return "Something went wrong!"
    }
    const dataFilter = data.filter(item => "currencies" in item);
    const dataCountries = dataFilter.map(item => {
        return `${item.flag} ${Object.keys(item.currencies)[0]} - ${item.name.common}`
    })
    //console.log(dataCountries)
    return (
        <Autocomplete
        sx={{width:300, background: '#fdfdfd', boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)", 
        borderRadius: 2, marginBottom:"2%", padding: "4rem, 2rem"
    
    }}
        value={value}
        onChange = {(event, newValue) => {
            setValue(newValue);
        }}
        options = {dataCountries}
        renderInput={(params) => <TextField {...params} label={label} />}
        />
    )
}


export default CountrySelect