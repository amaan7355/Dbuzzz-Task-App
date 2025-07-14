
export const validateEmail = (email: string): boolean => {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) {
        return true;
    } else {
        return false;
    }
}

export const validateName = (name: string): boolean => {
    const nameFormat = /^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){2,30}/;
    if (name !== '' && name.match(nameFormat)) {
        return true;
    } else {
        return false;
    }
}


export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{7,15}$/;
    return passwordRegex.test(password);
};


