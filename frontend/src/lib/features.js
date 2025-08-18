import moment from "moment";

const fileFormat = (url = "") => {
    const fileExtension = url.split(".").pop();
    const vidExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    if(vidExtensions.includes(fileExtension))return "video";
    if(audioExtensions.includes(fileExtension))return "audio";
    if(imageExtensions.includes(fileExtension))return "image";
    return "file";
}

const transformImage = (url = "") => {
    if(url.includes("upload")) return url.replace("upload", `upload/dpr_auto/w_auto`)
    return url;
}

const getLast7Days = () => {
    const currentDate = moment();
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.unshift(currentDate.format('MMM D'));
        currentDate.subtract(1, 'days');
    }
    return days;
}

const getOrSaveFromStorage = ({key, value, get}) => {
    if(get) return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    localStorage.setItem(key, JSON.stringify(value));
}

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage }