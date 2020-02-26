import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withSnackbar } from 'notistack';
import prettyBytes from 'pretty-bytes';
import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadByCSV } from '../../services/user.service';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1, 4),
    display: 'flex',
    flexAlign: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    minHeight: 150
  }
}));

const getUploadStatus = (file = null, uploadProgress = 0) => {
  const loading = uploadProgress < 100;

  const status = file
    ? {
      // file attached
      caption: prettyBytes(file.size),
      title: file.name
    }
    : uploadProgress
      ? {
        // uploading
        caption: loading ? `${uploadProgress}%` : 'Might take a while',
        title: loading ? 'Uploading' : 'Parsing & Storing'
      }
      : {
        // waiting for a file
        caption: 'or click to select a file',
        title: 'Drag & drop a .csv file here'
      };

  return (
    <div className="noselect">
      <Box fontSize={14}>{status.title}</Box>
      <Box fontSize={10}>{status.caption}</Box>
      {uploadProgress ? (
        <Box style={{ margin: '10px 15%' }}>
          <LinearProgress
            value={uploadProgress}
            style={{ height: 5, borderRadius: 5, margin: 10 }}
            variant={loading ? 'determinate' : 'indeterminate'}
          />
        </Box>
      ) : null}
    </div>
  );
};

export function DropZone({ enqueueSnackbar }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const classes = useStyles();
  const onDrop = useCallback((files) => files.length && setFile(files[0]), []);
  const uploadStatus = useMemo(() => getUploadStatus(file, progress), [file, progress]);
  const { getRootProps, getInputProps } = useDropzone({ accept: 'text/csv', onDrop });

  const onUploadProgress = useCallback((e) => {
    const done = e.position || e.loaded;
    const total = e.totalSize || e.total;
    const percent = Math.floor((done / total) * 1000) / 10;
    setProgress(percent);
    if (percent >= 100) {
      enqueueSnackbar(`File uploaded!`, { variant: 'info' });
    }
  }, [enqueueSnackbar]);

  const onUploadClick = () => {
    if (!file) return;

    uploadByCSV(file, { onUploadProgress })
      .then((response) => {
        const { fileName, insertedCount } = response.data;
        enqueueSnackbar(
          `The file ${fileName} parsed successfully! Inserted ${insertedCount} users!`,
          { variant: 'info' }
        );
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => {
        setProgress(0);
      });

    setFile(null);
  };

  return (
    <>
      <Paper {...getRootProps()} className={classes.paper} variant="outlined">
        <input {...getInputProps()} id="uploadField"/>
        {uploadStatus}
      </Paper>
      <Button
        id="uploadButton"
        onClick={onUploadClick}
        disabled={!file}
        size="small"
        startIcon={<CloudUploadIcon/>}>
        Upload
      </Button>
    </>
  );
}

export default withSnackbar(DropZone);
