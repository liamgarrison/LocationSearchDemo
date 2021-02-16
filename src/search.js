import React, { useEffect, useState} from 'react'
import axios from 'axios'

export const Search = () => {

    const [searchValue, searchValueUpdate] = useState("")
    const [searchLongEnough, searchLongEnoughUpdate] = useState("")
    const [returnedValues, updateReturnedValues] = useState("")
    const [error, updateError] = useState("")
    const [wrongSearchedTerm, wrongSearchedTermUpdate] = useState("")

    useEffect(() => {
        if(searchLongEnough.length !== 0){
        axios.get(`/locations?search=${searchLongEnough}`).then(data => {
            console.log(data.data)
            if(data.data.value){
                wrongSearchedTermUpdate(true)
                updateReturnedValues(data.data.results)
            }
            else{
                updateReturnedValues(data.data)
            }
           
        }).catch(err => {
            updateError(true)
        })
    }
    },[searchLongEnough])

    return(
        <div>
            <div>Please search for your location:</div>
            <input
                value={searchValue}
                onChange={(e) => {
                    wrongSearchedTermUpdate(false)
                    if(e.target.value.length >= 2){
                        searchLongEnoughUpdate(e.target.value)
                    }
                    else{
                        searchLongEnoughUpdate("")
                        updateReturnedValues([])
                    }
                    searchValueUpdate(e.target.value)
                }}
            ></input>
           {wrongSearchedTerm && <div>Your search has not matched: did you mean any of the ones below:</div>}

            {returnedValues.length > 0 && returnedValues.map((value,index) => {
                return(
                   
                    <div style={{display: "flex"}}>
                    {value[0] === "no results found" && <div key={value[3]}>{value[0] }</div>}
                    {value[0] !== "no results found" && <div key={value[3]}>{value[0] + " " + `(${value[1]})` + " " + `(${value[2]})` }</div>}
                    </div>
                )
            })}
            {error && <div>There was an error with the server, please try again later</div>}
           
        </div>
    )
}