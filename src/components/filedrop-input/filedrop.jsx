import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import './filedrop.css'
import notification from '../../utils/notification';

import fileIcon from '../../assets/icons/file.png';

function FileDrop({handleFileImport}) {
    const [projectName, setProjectName] = useState(null);
    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles.length !== 1){
            notification('Just one file at a time', false, 'error');
            return;
        }

        const file = acceptedFiles[0];

        if(!file.name.endsWith('.taskflow')){
            notification('Only .taskflow files are accepted', false, 'error');
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            const fileContent = e.target.result;
            try{
                const jsonData = JSON.parse(fileContent);
                setProjectName(jsonData.name)
                handleFileImport(jsonData)
            } catch(err){
                console.error('Error reading file: ', err);
            }
        };

        reader.readAsText(file);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div className={isDragActive ? 'file-drop-active' : 'file-drop'} {...getRootProps()}>
        <input {...getInputProps()}/>
        <img className='file-icon' src={fileIcon} alt="" />
        {projectName ? 
        (
            <h2 className='file-name'>{projectName}</h2>
        ) :
        (
            isDragActive ? 
            <p className='file-text'>Drop the file here...</p> :
            <p className='file-text'>Drag & drop the file here or click to select</p>
        )
        }
    </div>
  )
}

export default FileDrop
