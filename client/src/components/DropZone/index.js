import React, { useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
//import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { useStyles } from "./styles.js";


const DropZone = ({ onFileUploaded })  => {
    const classes = useStyles();
    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];     
        const fileUrl = URL.createObjectURL(file); 
        console.log(fileUrl);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop, 
        accept: 'image/*'
    });

    return (
        <div className={classes.dropzone} {...getRootProps()}>
            <input {...getInputProps()} accept='image/*' />

            { selectedFileUrl 
                ? <img src={selectedFileUrl} alt="Point thumbnail"/>
                : (
                    <p>
                    <Typography variant="h5" className={classes.text}>                   
                        Click to select files.
                    </Typography>
                    </p>
                )
            }
        </div>
    );
}

export default DropZone;