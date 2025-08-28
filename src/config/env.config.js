

class Config {
    Dev;
    LOCAL_API_URL;
    API_URL;
    BACKEND_URL;
    LOCAL_BACKEND_URL;
    constructor(){
        this.Dev = import.meta.env.VITE_Dev;
        this.LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
        this.API_URL = import.meta.env.VITE_API_URL;
        this.BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        this.LOCAL_BACKEND_URL = import.meta.env.VITE_LOCAL_BACKEND_URL;
    }
}

export const config = new Config();























