const buttonClass = 'ya-share__button';
const controlsPanelClass = 'player-controls__track-controls';
const originalShareButtonClass = 'd-share-popup.d-share-popup_btn';

const checkInterval = 500;

const canvas = document.getElementById('canvas');

async function convertBlobToPngBlob(imgPath) {
	return new Promise((resolve) => {
		const c = document.createElement('canvas')
		const ctx = c.getContext('2d')
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = function(){
			c.width = this.naturalWidth
			c.height = this.naturalHeight
			ctx.drawImage(this,0,0)
			c.toBlob(blob=>{
				resolve(blob)
			},'image/png')
		};
		img.src = imgPath;
	});
}

async function copyTrackInfoToClipboard() {
	const info = externalAPI.getCurrentTrack();
	const artists = info.artists.map((a) => a.title).join(', ');
	const trackName = info.title;
	const link = 'https://music.yandex.ru' + info.link;
	
	const result = `${artists} - ${trackName} (${link})`;
	const type = 'text/plain';
	const textBlob = new Blob([result], { type });
	
	const albumCover = 'https://' + info.album.cover.replace('%%', '200x200');
	const imageBlob = await convertBlobToPngBlob(albumCover);

	const clipItem = new ClipboardItem({
		[type]: textBlob,
		[imageBlob.type]: imageBlob
	});
	
	navigator.clipboard.write([clipItem]).then(
        () => console.log('copied'),
        (e) => console.log('nope', e)
    );
}

function addNewButton() {
	const controls = document.querySelector(`.${controlsPanelClass}`);
	const originalShareButton = controls.querySelector(`.${originalShareButtonClass}`);
	const newButton = originalShareButton.cloneNode(true);
	newButton.classList.add(buttonClass);
	newButton.removeAttribute('data-b');
	newButton.addEventListener('click', copyTrackInfoToClipboard);

	originalShareButton.parentNode.insertBefore(newButton, originalShareButton.nextSibling);
}

const readyPromise = new Promise((resolve) => {
	// what a decent way to check whether player has been render :D
	const intId = setInterval(() => {
		const controls = document.querySelector(`.${controlsPanelClass}`);
		if (controls) {
			clearInterval(intId);
			resolve(true);
		}
	}, checkInterval);
})

readyPromise.then(() => {
	console.log('kek');
	addNewButton();
});
