import './css/styles.css';
import ImageApiService from './js/pixabay-api-service';
import LoadMoreBtn from './js/load-more-btn';
import { makeImageMarkup } from './js/image-markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const galleryDiv = document.querySelector('.gallery');

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({ selektor: '.load-more', hidden: true });
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, });

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
    e.preventDefault();

    const searchText = e.currentTarget.elements.searchQuery.value.trim();
    if (searchText === '') {
        return Notify.info(`Enter a word to search for images.`);
    }
    imageApiService.searchQuery = searchText;
    loadMoreBtn.show();
    imageApiService.resetPage();
    clearImageContainer();
    fetchImages();
}

function clearImageContainer() {
    galleryDiv.innerHTML = '';
}

function fetchImages() {
    loadMoreBtn.disabled();
    imageApiService.fetchImages().then(({data}) => {
        if (data.total === 0) {
            Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            loadMoreBtn.hide();
            return;
        }
        appendImagesMarkup(data);
        onPageScrolling()
        lightbox.refresh();
        const { totalHits } = data;

        if (galleryDiv.children.length === totalHits ) {
            Notify.warning(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.hide();
        } else {
            loadMoreBtn.enable();
            Notify.success(`Hooray! We found ${totalHits} images.`);
        }
    }).catch(handleError);
}

function handleError() {
    console.log('Error!');
}

function appendImagesMarkup(data) {
    galleryDiv.insertAdjacentHTML('beforeend', makeImageMarkup(data));
}

function onPageScrolling(){ 
    const { height: cardHeight } = galleryDiv.firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
        });
}