import React from 'react'
import ImageUploading from 'react-images-uploading';
import ArrowIcon from '../images/ArrowIcon';
import { Box, Button } from '@shopify/polaris';
import UpdateIcon from '../images/UpdateIcon';
import DeleteIcon from '../images/DeleteIcon';

export default function ImageUpload(props) {
    const [images, setImages] = React.useState([]);
    const maxNumber = 2;
    const onChange = (imageList, addUpdateIndex) => {
        // console.log(imageList);
        setImages(imageList);
        // console.log('custom',{...props.currentSetting, iconColor:'',customIcon: imageList});
        props.setCurrentSetting({ ...props.currentSetting, iconColor: '',customIcon: imageList })
    };

    if (typeof window !== 'undefined') {
        return (
            // <Box  style={styles.uploadContainer}>
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={["jpg"]}
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps
                }) => (
                    // write your building UI
                    <Box style={{
                        height: '100%', display: 'flex',
                        width: '100%', justifyContent: 'center', backgroundColor: 'rgb(244, 246, 248)', padding: 8,
                    }} >
                        {/* <Button style={[styles.buttonContainer,isDragging ? { color: "red" } : null]}   onClick={onImageUpload}
                {...dragProps}>
                  {images.length === maxNumber ? '':  <ArrowIcon />} 
                </Button> */}
                        {images.length !== maxNumber && (
                            <button style={styles.buttonContainer} onClick={onImageUpload} {...dragProps} >
                                {images.length === maxNumber ? '' : <ArrowIcon />}
                            </button>
                        )}

                        {imageList.map((image, index) => (
                            <Box style={styles.boxItem} key={index}>
                                <div className="image-item" style={styles.boxContent}>
                                    <img src={image.data_url} alt="" width="20" height="20" style={{ objectFit: 'contain' }} />
                                </div>
                                <div className="image-item__btn-wrapper">
                                    {/* <button onClick={() => onImageUpdate(index)}><UpdateIcon /></button>
                                    <button onClick={() => onImageRemove(index)}><DeleteIcon /></button> */}
                                    <button onClick={() => onImageUpdate(index)}>Update</button>
                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                            </Box>


                        ))}
                    </Box>
                )}
            </ImageUploading>
            // {/* </Box> */}
        )
    }
    else {
        return (
            <div className="App">
                <h1>Hello</h1>
            </div>
        )
    }
}


const styles = {
    uploadContainer: {
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        maxHeight: 46,
        border: 'none ',
        background: 'none'
    },
    boxContent: {
        position: 'relative',
        width: '100%',
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: '12px 0',
        backgroundColor: '#f4f6f8',
        borderRadius: '3px',
        cursor: 'pointer',
        gap: 4
    },
    boxItem: {
        // flex: '1 1 6%',
        // maxWidth: '100%',
        // minWidth: 'auto',
        // border: '1px solid #ccc',
        // mrgin: '0 aoto',
        // justifyContent: 'center'
    },
}