document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('memory-form');
  const submitBtn = document.getElementById('submit-btn');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(e => console.error("Audio play failed:", e));
        musicToggle.textContent = '🎵 Pause Music';
      } else {
        bgMusic.pause();
        musicToggle.textContent = '🎵 Play Music';
      }
    });
  }
  const loadingState = document.getElementById('loading-state');
  const errorMessage = document.getElementById('error-message');
  const inputSection = document.getElementById('input-section');
  const timelineEntries = document.getElementById('timeline-entries');
  const emptyState = document.getElementById('empty-state');
  const ambientOrb = document.getElementById('ambient-orb');
  const container = document.querySelector('.container');
  
  const reminisceBtn = document.getElementById('reminisce-btn');
  const exitReminisceBtn = document.getElementById('exit-reminisce-btn');
  const reminisceMode = document.getElementById('reminisce-mode');
  const reminisceContent = document.getElementById('reminisce-content');
  const demoBtn = document.getElementById('demo-btn');

  let allEntries = [];
  let reminisceInterval = null;

  const themeColors = {
    joy: 'var(--glow-joy)',
    tender: 'var(--glow-tender)',
    nostalgia: 'var(--glow-nostalgia)',
    melancholy: 'var(--glow-melancholy)',
    peace: 'var(--glow-peace)'
  };

  // Set initial glow
  document.documentElement.style.setProperty('--current-glow', themeColors.peace);

  function triggerGatheringLight() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    container.innerHTML = ''; // clear old

    const numOrbs = 25;
    for(let i=0; i<numOrbs; i++) {
      const orb = document.createElement('div');
      orb.className = 'light-particle';
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 50; // 50vw to 100vw away
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      
      orb.style.setProperty('--startX', `${startX}vw`);
      orb.style.setProperty('--startY', `${startY}vh`);
      
      const duration = 2.0 + Math.random() * 2.0;
      orb.style.animationDuration = `${duration}s`;
      orb.style.animationDelay = `${Math.random() * 0.8}s`;
      
      container.appendChild(orb);
    }
  }

  async function generateMemory(rawDate, title, feeling, description) {
    if (!rawDate || !title || !feeling) return;

    const dateObj = new Date(rawDate);
    const date = isNaN(dateObj) ? rawDate : dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

    inputSection.classList.add('dimmed');
    submitBtn.classList.add('hidden');
    loadingState.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    triggerGatheringLight();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, title, feeling, description })
      });

      if (!response.ok) {
        throw new Error('Server returned ' + response.status);
      }

      const data = await response.json();
      
      addTimelineEntry({
        date,
        title,
        description,
        poemLines: data.poemLines,
        emotionTheme: data.emotionTheme || 'peace'
      });

      document.getElementById('title').value = '';
      document.getElementById('feeling').value = '';
      document.getElementById('description').value = '';

    } catch (err) {
      console.error(err);
      errorMessage.textContent = "The candlelight flickered. Please try again.";
      errorMessage.classList.remove('hidden');
    } finally {
      inputSection.classList.remove('dimmed');
      submitBtn.classList.remove('hidden');
      loadingState.classList.add('hidden');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawDate = document.getElementById('date').value.trim();
    const title = document.getElementById('title').value.trim();
    const feeling = document.getElementById('feeling').value.trim();
    const description = document.getElementById('description').value.trim();
    
    await generateMemory(rawDate, title, feeling, description);
  });

  function addTimelineEntry(entry) {
    emptyState.classList.add('hidden');

    const entryColor = themeColors[entry.emotionTheme] || themeColors.peace;
    
    // Update ambient orb
    document.documentElement.style.setProperty('--current-glow', entryColor);

    const el = document.createElement('div');
    el.className = 'timeline-entry';
    el.style.setProperty('--entry-glow', entryColor);

    const poemHtml = entry.poemLines.map(line => `<span>${line}</span><br>`).join('');

    el.innerHTML = `
      <div class="entry-date">${entry.date}</div>
      <div class="entry-title">${entry.title}</div>
      <div class="entry-poem">
        ${poemHtml}
      </div>
      ${entry.description ? `<div class="entry-desc">${entry.description}</div>` : ''}
    `;

    // Prepend to timeline
    timelineEntries.insertBefore(el, timelineEntries.firstChild);
    
    // Track entry for reminiscing and brightness
    allEntries.push(entry);
    
    // Dynamic Orb Brightness
    const baseOpacity = 0.15;
    const maxBonusOpacity = 0.6;
    const currentBonusOpacity = maxBonusOpacity * (1 - (1 / (1 + 0.5 * allEntries.length)));
    
    const baseScale = 1.0;
    const maxBonusScale = 1.0;
    const currentBonusScale = maxBonusScale * (1 - (1 / (1 + 0.3 * allEntries.length)));

    document.documentElement.style.setProperty('--orb-opacity', baseOpacity + currentBonusOpacity);
    document.documentElement.style.setProperty('--orb-scale', baseScale + currentBonusScale);

    if (reminisceBtn.classList.contains('hidden')) {
      reminisceBtn.classList.remove('hidden');
    }

    // Scroll into view gently
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Reminisce Logic
  reminisceBtn.addEventListener('click', () => {
    if (allEntries.length === 0) return;
    
    // Fade out main UI, fade in reminisce overlay
    container.classList.add('hidden-for-reminisce');
    reminisceMode.classList.remove('hidden');
    
    setTimeout(() => {
      reminisceMode.classList.add('active');
    }, 50);

    let currentIndex = 0;
    
    const showNextEntry = () => {
      if (currentIndex >= allEntries.length) {
        endReminiscing();
        return;
      }
      
      const entry = allEntries[currentIndex];
      const entryColor = themeColors[entry.emotionTheme] || themeColors.peace;
      
      document.documentElement.style.setProperty('--current-glow', entryColor);

      reminisceContent.classList.remove('visible');
      
      setTimeout(() => {
        const poemHtml = entry.poemLines.map(line => `<span>${line}</span><br>`).join('');
        reminisceContent.innerHTML = `
          <div class="rem-date">${entry.date}</div>
          <div class="rem-title">${entry.title}</div>
          <div class="rem-poem" style="--entry-glow: ${entryColor}">${poemHtml}</div>
        `;
        
        reminisceContent.classList.add('visible');
      }, 1500);

      currentIndex++;
    };

    setTimeout(() => {
      showNextEntry();
      reminisceInterval = setInterval(showNextEntry, 8000);
    }, 1500);
  });

  function endReminiscing() {
    clearInterval(reminisceInterval);
    reminisceContent.classList.remove('visible');
    reminisceMode.classList.remove('active');
    
    setTimeout(() => {
      reminisceMode.classList.add('hidden');
      container.classList.remove('hidden-for-reminisce');
      
      if (allEntries.length > 0) {
        const lastEntry = allEntries[allEntries.length - 1]; // the newest one is at the end of the array
        const lastColor = themeColors[lastEntry.emotionTheme] || themeColors.peace;
        document.documentElement.style.setProperty('--current-glow', lastColor);
      }
    }, 1500);
  }

  exitReminisceBtn.addEventListener('click', endReminiscing);

  // Demo Mode
  demoBtn.addEventListener('click', async () => {
    demoBtn.disabled = true;
    demoBtn.textContent = '✨ Demo Running...';

    const sampleEvents = [
      { date: '2025-01-01', title: 'A New Beginning', feeling: 'Hopeful and excited', description: 'Moved to a new city, full of possibilities.' },
      { date: '2025-05-14', title: 'Adopted Barnaby', feeling: 'Overjoyed and chaotic', description: 'Brought our golden retriever puppy home.' },
      { date: '2025-11-20', title: 'Quiet Evening', feeling: 'Peaceful and warm', description: 'Read a book by the fireplace while it rained outside.' }
    ];

    for (const sample of sampleEvents) {
      document.getElementById('date').value = sample.date;
      document.getElementById('title').value = sample.title;
      document.getElementById('feeling').value = sample.feeling;
      document.getElementById('description').value = sample.description;
      
      await generateMemory(sample.date, sample.title, sample.feeling, sample.description);

      // Wait a bit before generating the next one
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
    
    demoBtn.textContent = '✨ Demo Complete';
  });
});
