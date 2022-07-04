import { useState, useEffect } from "react"
import TextField from "@mui/material/TextField";


export default function ValidationTextField( defaultValue, maxInt ) {
    const [value, setValue] = useState(defaultValue);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Set errorMessage only if text is equal or bigger than MAX_LENGTH
        if (value > maxInt) {
        setErrorMessage(
            "Maximum value is" + maxInt
        );
        }
    }, [value]);

    useEffect(() => {
        // Set empty erroMessage only if text is less than MAX_LENGTH
        // and errorMessage is not empty.
        // avoids setting empty errorMessage if the errorMessage is already empty
        if (value <= maxInt && errorMessage) {
        setErrorMessage("");
        }
    }, [value, errorMessage]);

    return (
        <TextField
        error={value > maxInt}
        id="outlined-error"
        label="Error"
        type={'number'}
        helperText={errorMessage}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        />
    );
    }