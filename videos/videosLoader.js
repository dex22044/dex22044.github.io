window.addEventListener('load', ()=>{
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://f0512394.xsph.ru/wp-content/videoData/videoData.json', false);
    xhr.send(null);
    loadVideosFromObject(JSON.parse(xhr.responseText));
});

function loadVideosFromObject(vids) {
    document.querySelector('.videos_panel').innerHTML = '';
    vids.forEach(element => {
        document.querySelector('.videos_panel').innerHTML += `
        <div class="video_box">
            <video class="video_preview" width="320" height="240" src="${element.previewSrc}" muted loop
                    onmouseover="this.play()" onmouseout="this.pause();this.currentTime=0"
                    onclick="changeVideo(this);">
                <input type="hidden" class="video_src_mem" value="${element.fullSrc}">
                <input type="hidden" class="video_name_mem" value="${element.name}">
                <input type="hidden" class="video_author_mem" value="${element.author}">
                <input type="hidden" class="video_time_mem" value="${element.time}">
            </video>
            <div class="video_data_row">
                <span class="video_data_name">${element.name}</span>
                <div class="video_data_date_author_box">
                    <span>${element.author}</span>
                    <span>${element.time}</span>
                </div>
            </div>
        </div>
        `;
    });
}

function changeVideo(self) {
    $('.videoplayer_panel').fadeIn();
    $('.videoplayer_panel_video').prop('src', self.querySelector('.video_src_mem').value);
    $('.videoplayer_panel_title').text(self.querySelector('.video_name_mem').value);
    $('.videoplayer_panel_author').text(self.querySelector('.video_author_mem').value);
    $('.videoplayer_panel_time').text(self.querySelector('.video_time_mem').value);
}