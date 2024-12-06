export const validateFormInput = (key, value) => {
    if(key === 'name'){
        const nameValidate = /[^a-zA-Z ]/;
        if (nameValidate.test(value)) {
            return 'Name should not contain numbers or special characters'
        }
        else if(value.length < 3){
            return 'Name should be atleast 3 characters long'
        }
    }
    else if(key === 'username'){
        const usernameValidate = /\s/
        if(usernameValidate.test(value)){
            return 'Username should not contain spaces'
        }
        else if(value.length < 6){
            return 'Username should be atleast 6 characters long'
        }
    }
    else if(key === 'password'){
        if(value.length < 8){
            return 'Password should be a minimum of 8 letters'
        }
    }
    return "";
}