import axios from "axios";
axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '34042567-a3d7a91850581734aa5c54b07';
const PARAM = 'per_page=40&image_type=photo&orientation=horizontal&safesearch=true';

export default class ImageApiService {
    constructor(){
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImages () {
        try{
            const response = await axios.get(`/?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&${PARAM}`);
            this.incrementPage();
            return response;
        
        } catch (error) {
            console.log(error);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}