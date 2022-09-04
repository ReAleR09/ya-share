const checkInterval = 100;

const controlBtnPlaylistClass = 'player-controls__btn_seq';

async function copyTrackInfoToClipboard() {
	const info = externalAPI.getCurrentTrack();
	const artists = info.artists.map((a) => a.title).join(', ');
	const trackName = info.title;
	const link = 'https://music.yandex.ru' + info.link;
	
	const trackFullTitle = `${artists} - ${trackName}`;

	const plainText = `${trackFullTitle} [${link}]`;
	const textBlob = new Blob([plainText], { type: 'text/plain' });

	const html = `<a href="${link}">${trackFullTitle}</a>`;
	const htmlBlob = new Blob([html], { type: 'text/html' });

	const clipItem = new ClipboardItem({
		[textBlob.type]: textBlob,
		[htmlBlob.type]: htmlBlob
	});
	
	navigator.clipboard.write([clipItem]).then(
        () => console.log('copied'),
        (e) => console.log('nope', e)
    );
}

function addNewButton() {
	const newButton = document.createElement('div');
	newButton.classList.add('player-controls__btn', 'deco-player-controls__button', 'd-icon', 'd-icon_share');
	newButton.addEventListener('click', copyTrackInfoToClipboard);

	const playlistBtnEl = document.querySelector(`.${controlBtnPlaylistClass}`);
	playlistBtnEl.parentNode.insertBefore(newButton, playlistBtnEl.nextSibling);
}

const readyPromise = new Promise((resolve) => {
	// what a decent way to check whether player has been render :D
	const intId = setInterval(() => {
		const controls = document.querySelector(`.${controlBtnPlaylistClass}`);
		if (controls) {
			clearInterval(intId);
			resolve(true);
		}
	}, checkInterval);
})

readyPromise.then(() => {
	addNewButton();
});
