import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";


const ValidationTextField = ( {label, defaultValue, maxInt} ) => {
    const [value, setValue] = useState(defaultValue);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Set errorMessage only if text is equal or bigger than MAX_LENGTH
        if (value > maxInt) {
        setErrorMessage(
            "Maximum value is " + maxInt
        );
        }
    }, [value]);

    useEffect(() => {
        // Set empty erroMessage only if text is less than MAX_LENGTH
        // and errorMessage is not empty.
        // avoids setting empty errorMessage if the errorMessage is already empty
        if (value <= maxInt && errorMessage) { // Why oh why hath JS forsaken me, leeq not working
        setErrorMessage("");
        }
    }, [value, errorMessage]);

    return (
        <TextField
        error={value > maxInt}
        id="outlined-error"
        label={label}
        type={'number'}
        helperText={errorMessage}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        />
    );
}

ValidationTextField.defaultProps = {
    defaultValue: 0,
    maxInt: 100,
    label: "Int Box"
};

export default ValidationTextField;