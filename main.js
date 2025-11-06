const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const playIcon = document.getElementById('playicon');
    const bar = document.getElementById('bar');
    const thumb = document.getElementById('thumb');
    const progress = document.getElementById('progress');
    const currentEl = document.getElementById('current');
    const durationEl = document.getElementById('duration');
    const fileInput = document.getElementById('file');
    const cover = document.getElementById('cover');
    const volbar = document.getElementById('volbar');
    const volslider = document.getElementById('volslider');
    const speedEl = document.getElementById('speed');

    // default: optional sample URL (commented). User should load local audio.
    // audio.src = 'https://www.example.com/sample.mp3';

    function formatTime(t){
      if (!isFinite(t)) return '0:00';
      const m = Math.floor(t/60);
      const s = Math.floor(t%60).toString().padStart(2,'0');
      return m + ':' + s;
    }

    playBtn.addEventListener('click', ()=>{
      if(audio.paused){ audio.play(); } else { audio.pause(); }
    });

    audio.addEventListener('play', ()=>{
      // change icon to pause
      playIcon.innerHTML = '<path d="M6 6h4v12H6zM14 6h4v12h-4z"/>';
    });
    audio.addEventListener('pause', ()=>{
      playIcon.innerHTML = '<path d="M6 4l15 8-15 8z"/>';
    });

    audio.addEventListener('timeupdate', ()=>{
      const pct = audio.currentTime / (audio.duration || 1);
      bar.style.width = (pct*100)+'%';
      thumb.style.left = (pct*100)+'%';
      currentEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = '-' + formatTime((audio.duration||0) - audio.currentTime);
      thumb.style.display = (audio.duration>0)?'block':'none';
    });

    audio.addEventListener('loadedmetadata', ()=>{
      durationEl.textContent = '-' + formatTime(audio.duration);
    });

    progress.addEventListener('click', (e)=>{
      const rect = progress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      audio.currentTime = pct * (audio.duration || 0);
    });

    // file loader
    fileInput.addEventListener('change', (e)=>{
      const f = e.target.files[0];
      if(!f) return;
      const url = URL.createObjectURL(f);
      audio.src = url;
      // try to set title from filename
      const name = f.name.replace(/\.[^/.]+$/,"");
      document.getElementById('title').textContent = name;
      document.getElementById('artist').textContent = 'Local file';
      audio.play();
    });

    // change cover by clicking
    cover.addEventListener('click', ()=>{
      const img = document.createElement('input');
      img.type = 'file'; img.accept = 'image/*';
      img.onchange = e=>{
        const fi = e.target.files[0]; if(!fi) return;
        cover.src = URL.createObjectURL(fi);
      }
      img.click();
    });

    // volume slider interaction
    volslider.addEventListener('click', e=>{
      const r = volslider.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left)/r.width));
      audio.volume = pct; volbar.style.width = (pct*100)+'%';
    });

    // keyboard shortcuts
    document.addEventListener('keydown', e=>{
      if(e.code === 'Space') { e.preventDefault(); if(audio.paused) audio.play(); else audio.pause(); }
      if(e.code === 'ArrowRight') audio.currentTime = Math.min(audio.duration||0, audio.currentTime + 10);
      if(e.code === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 10);
      if(e.code === 'ArrowUp') audio.volume = Math.min(1, audio.volume + 0.05);
      if(e.code === 'ArrowDown') audio.volume = Math.max(0, audio.volume - 0.05);
    });

    // playback rate toggle on speed element
    speedEl.addEventListener('click', ()=>{
      const rates = [1, 1.25, 1.5, 2];
      const cur = audio.playbackRate || 1;
      const idx = (rates.indexOf(cur) + 1) % rates.length;
      audio.playbackRate = rates[idx];
      speedEl.textContent = rates[idx] + 'x';
    });

    // init defaults
    audio.volume = 0.75; volbar.style.width = (audio.volume*100)+'%';