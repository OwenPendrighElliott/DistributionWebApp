import { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import DistributionContext from "../contexts/distributionContext";

const MaxValidationTextField = ( {label, defaultValue, maxInt} ) => {
    // const [value, setValue] = useState(defaultValue);

    const { xMin, setXMin } = useContext(DistributionContext);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setXMin(defaultValue);
    }, []);

    useEffect(() => {
        // Set errorMessage only if the number is greater than the allowable max number
        if (xMin >= maxInt) {
            setErrorMessage(
                "Must be less than " + (maxInt-1)
            );
        }
    }, [xMin]);

    useEffect(() => {
        // Set empty erroMessage only if number is less than max number
        // and errorMessage is not empty.
        // avoids setting empty errorMessage if the errorMessage is already empty
        if (xMin < maxInt && errorMessage) {
            setErrorMessage("");
        }
    }, [xMin, errorMessage]);

    return (
        <TextField
        error={Number(xMin) >= maxInt}
        id="outlined-error"
        label={label}
        type={'number'}
        helperText={errorMessage}
        onChange={(e) => setXMin(e.target.value)}
        value={xMin}
        />
    );
}

MaxValidationTextField.defaultProps = {
    defaultValue: 0,
    maxInt: 100,
    label: "Int Box"
};

const MinValidationTextField = ( {label, defaultValue, minInt} ) => {
    // const [value, setValue] = useState(defaultValue);

    const { xMax, setXMax } = useContext(DistributionContext);    
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setXMax(defaultValue);
    }, []);

    useEffect(() => {
        // Set errorMessage only if number is less than the allowed minimum
        console.log(xMax)
        if (Number(xMax) <= minInt) {
            setErrorMessage(
                "Must be greater than " + minInt
            );
        }
    }, [xMax]);

    useEffect(() => {
        // Set empty erroMessage only if number is greater than the minimum
        // and errorMessage is not empty.
        // avoids setting empty errorMessage if the errorMessage is already empty
        if (Number(xMax) > minInt && errorMessage) {
            setErrorMessage("");
        }
    }, [xMax, errorMessage]);

    return (
        <TextField
        error={Number(xMax) <= minInt}
        id="outlined-error"
        label={label}
        type={'number'}
        helperText={errorMessage}
        onChange={(e) => setXMax(e.target.value)}
        value={xMax}
        />
    );
}

MinValidationTextField.defaultProps = {
    defaultValue: 100,
    minInt: 0,
    label: "Int Box"
};

export { MaxValidationTextField, MinValidationTextField};