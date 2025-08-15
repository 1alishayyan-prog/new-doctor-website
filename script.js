document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    //  HEADER: MOBILE MENU TOGGLE
    // =================================================================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // =================================================================
    //  GLOBAL: ON-SCROLL FADE-IN ANIMATION
    // =================================================================
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Apply a staggered delay for a smoother visual effect
                const delay = entry.target.dataset.delay || (index * 100);
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('is-visible');
                // Stop observing the element once it has faded in
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px 0px 200px', threshold: 0 });

    // Apply the observer to all elements with the .fade-in or .bar-item class
    document.querySelectorAll('.fade-in, .bar-item').forEach((el, index) => {
        // Assign a specific delay for bar items to make them appear sequentially
        el.dataset.delay = el.classList.contains('bar-item') ? index * 150 : index * 100;
        fadeInObserver.observe(el);
    });

    // =================================================================
    //  GLOBAL: NUMBER COUNT-UP ANIMATION
    // =================================================================
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberStats = entry.target.querySelectorAll('.number-stat, .stat-number');
                numberStats.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const decimals = +stat.getAttribute('data-decimals') || 0;
                    const duration = 1500; // Animation duration in milliseconds
                    const increment = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                        }
                        // Preserve any text suffix like '%' or '+'
                        const suffix = stat.innerText.replace(/[0-9.]/g, '');
                        stat.innerText = current.toFixed(decimals) + suffix;
                    }, 16); // Runs roughly every frame (60fps)
                });
                observer.unobserve(entry.target); // Animate only once per element
            }
        });
    }, { threshold: 0.5 });

    // Observe both stats containers (Section 1 and Section 7a)
    const statsContainer = document.getElementById('stats-container');
    const statsCardsContainer = document.getElementById('stats-cards-container');
    if (statsContainer) statsObserver.observe(statsContainer);
    if (statsCardsContainer) statsObserver.observe(statsCardsContainer);

    // =================================================================
    //  SECTION 1: CLICK-TO-COPY PHONE NUMBER
    // =================================================================
    const copyBtn = document.getElementById('copy-phone-btn');
    if (copyBtn) {
        const copyTextSpan = document.getElementById('copy-text');
        const originalText = copyTextSpan.innerText;
        
        copyBtn.addEventListener('click', () => {
            const numberToCopy = copyBtn.getAttribute('data-number');
            
            navigator.clipboard.writeText(numberToCopy).then(() => {
                copyTextSpan.innerText = 'Number Copied!';
                copyBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-600');
                // Revert the text and style after 2 seconds
                setTimeout(() => {
                    copyTextSpan.innerText = originalText;
                    copyBtn.classList.remove('bg-green-100', 'border-green-500', 'text-green-600');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy number: ', err);
                copyTextSpan.innerText = 'Copy Failed';
                setTimeout(() => { copyTextSpan.innerText = originalText; }, 2000);
            });
        });
    }

    // =================================================================
    //  SECTION 2: IMAGE CAROUSEL
    // =================================================================
    const mainCarouselContainer = document.getElementById('carousel-main');
    const thumbnailsContainer = document.getElementById('carousel-thumbnails');
    if (mainCarouselContainer && thumbnailsContainer) {
        const slidesData = [
            { mainImage: 'images/facility-one.jpg', thumbImage: 'images/facility-thumb-one.jpg', title: 'Advanced ENT procedures', description: 'State-of-the-art equipment.' },
            { mainImage: 'images/facility-two.jpg', thumbImage: 'images/facility-thumb-two.jpg', title: 'Endoscopic Examination', description: 'Minimally invasive techniques.' },
            { mainImage: 'images/facility-three.jpg', thumbImage: 'images/facility-thumb-three.jpg', title: 'Trained under Top ENT Surgeons', description: 'Affiliate links to best ENT Specialists.' },
            { mainImage: 'images/facility-four.jpg', thumbImage: 'images/facility-thumb-four.jpg', title: 'Modern Operation Theater', description: 'with Comfortable and private rooms.' }
        ];
        let currentIndex = 0;
        let carouselInterval;

        // Function to dynamically build the carousel from the slidesData array
        function createCarousel() {
            slidesData.forEach((slide, index) => {
                const slideEl = document.createElement('div');
                slideEl.className = `carousel-slide w-full h-full absolute top-0 left-0 ${index === 0 ? 'active' : ''}`;
                slideEl.innerHTML = `<img src="${slide.mainImage}" alt="${slide.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/800x500/3B82F6/FFFFFF?text=Image+${index+1}';"><div class="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/70 to-transparent text-white"><h3 class="text-3xl font-bold">${slide.title}</h3><p class="mt-2 max-w-2xl">${slide.description}</p></div>`;
                mainCarouselContainer.appendChild(slideEl);
            });
            slidesData.forEach((slide, index) => {
                const thumbEl = document.createElement('div');
                thumbEl.className = `thumbnail rounded-lg overflow-hidden ${index === 0 ? 'active' : ''}`;
                thumbEl.dataset.index = index;
                thumbEl.innerHTML = `<img src="${slide.thumbImage}" alt="Thumbnail for ${slide.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https.placehold.co/200x125/3B82F6/FFFFFF?text=Thumb+${index+1}';">`;
                thumbnailsContainer.appendChild(thumbEl);
            });
            mainCarouselContainer.innerHTML += `<div class="carousel-arrow left" id="prev-slide"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></div><div class="carousel-arrow right" id="next-slide"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div>`;
        }

        // Function to display a specific slide
        function showSlide(index) {
            const slides = mainCarouselContainer.querySelectorAll('.carousel-slide');
            const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
            if (index >= slides.length || index < 0) return;
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
            currentIndex = index;
        }
        
        function nextSlide() { showSlide((currentIndex + 1) % slidesData.length); }
        function prevSlide() { showSlide((currentIndex - 1 + slidesData.length) % slidesData.length); }
        function startAutoPlay() { stopAutoPlay(); carouselInterval = setInterval(nextSlide, 3000); }
        function stopAutoPlay() { clearInterval(carouselInterval); }

        createCarousel();
        document.getElementById('next-slide').addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });
        document.getElementById('prev-slide').addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });
        thumbnailsContainer.addEventListener('click', (e) => {
            const thumb = e.target.closest('.thumbnail');
            if (thumb) { showSlide(parseInt(thumb.dataset.index, 10)); stopAutoPlay(); startAutoPlay(); }
        });
        startAutoPlay();
    }
});
