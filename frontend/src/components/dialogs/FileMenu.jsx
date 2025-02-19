import { Menu, MenuList, MenuItem, Tooltip, ListItemText } from '@mui/material'
import { Image as ImageIcon, AudioFile as AudioFileIcon, VideoFile as VideoFileIcon, UploadFile as UploadFileIcon } from '@mui/icons-material'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/miscSlice'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api'

const FileMenu = ({ anchorE1, chatId }) => {
    const { isFileMenu } = useSelector(state => state.misc)
    const dispatch = useDispatch();
    const [sendAttachment] = useSendAttachmentsMutation();

    const imageRef = useRef(null)
    const audioRef = useRef(null)
    const videoRef = useRef(null)
    const fileRef = useRef(null)
    
    const selectAudio = () => audioRef.current?.click()
    const selectImage = () => imageRef.current?.click()
    const selectVideo = () => videoRef.current?.click()
    const selectFile = () => fileRef.current?.click()

    const closeFileMenu = () => dispatch(setIsFileMenu(false))
    const fileChangeHandler = async(e, key) => {
        const files = Array.from(e.target.files)
        if(files.length === 0)
        if(files.length > 5) toast.error("You can only upload 5 files at a time")
        dispatch(setUploadingLoader(true));
        
        const toastId = toast.loading("Uploading files...")
        closeFileMenu();

        try{
            const myForm = new FormData();
            myForm.append("chatId", chatId)
            files.forEach((file) => {
                myForm.append("files", file)
            })
            const res = await sendAttachment(myForm)

            if(res.data) {
                toast.success(`${key} sent successfully`, {id : toastId});
                console.log(res.data);
            }
            else toast.error("Failed to send the file", {id : toastId})
        }catch(err){
            toast.error(err, {id : toastId})
        }finally{
            dispatch(setUploadingLoader(false))
        }
        
    }
    return (
        <Menu open={isFileMenu} anchorEl={anchorE1} onClose={closeFileMenu}>
            <div style={{ width: "10rem" }}>
                <MenuList>
                    <MenuItem onClick={selectImage}>
                        <Tooltip title={"Image"}>
                            <ImageIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>
                            Image
                        </ListItemText>
                        <input type="file" multiple accept='image/png, image/jpeg, image/gif' style={{ visibility: "hidden" }} onChange={(e) => fileChangeHandler(e, "Images")} ref={imageRef}/>
                    </MenuItem>
                    <MenuItem onClick={selectAudio}>
                        <Tooltip title={"Audio"}>
                            <AudioFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>
                            Audio
                        </ListItemText>
                        <input type="file" multiple accept='audio/mpeg, audio/wav' style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Audios")} ref={audioRef}/>
                    </MenuItem>
                    <MenuItem onClick={selectVideo}>
                        <Tooltip title={"Video"}>
                            <VideoFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>
                            Video
                        </ListItemText>
                        <input type="file" multiple accept='video/mp4, video/webm, video/ogg' style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Videos")} ref={videoRef}/>
                    </MenuItem>
                    <MenuItem onClick={selectFile}>
                        <Tooltip title={"File"}>
                            <UploadFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>
                            Video
                        </ListItemText>
                        <input type="file" multiple accept='*' style={{ display: "none" }} onChange={(e) => fileChangeHandler(e, "Files")}ref={fileRef} />
                    </MenuItem>
                </MenuList>
            </div>
        </Menu >
    )
}

export default FileMenu