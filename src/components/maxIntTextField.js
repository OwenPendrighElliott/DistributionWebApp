import * as React from "react";
import TextField from "@mui/material/TextField";


export default function ValidationTextField( defaultValue, maxInt ) {
    const [value, setValue] = React.useState(defaultValue);
    const [errorMessage, setErrorMessage] = React.useState("");
    const maxInt = maxInt;

    React.useEffect(() => {
        // Set errorMessage only if text is equal or bigger than MAX_LENGTH
        if (value > maxInt) {
        setErrorMessage(
            "Maximum value is" + maxInt
        );
        }
    }, [text]);

    React.useEffect(() => {
        // Set empty erroMessage only if text is less than MAX_LENGTH
        // and errorMessage is not empty.
        // avoids setting empty errorMessage if the errorMessage is already empty
        if (value <= maxInt && errorMessage) {
        setErrorMessage("");
        }
    }, [text, errorMessage]);

    return (
        <TextField
        error={text.length >= MAX_LENGTH}
        id="outlined-error"
        label="Error"
        type={'number'}
        helperText={errorMessage}
        onChange={(e) => setText(e.target.value)}
        value={text}
        />
    );
    }