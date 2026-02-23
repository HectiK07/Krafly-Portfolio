document.addEventListener('DOMContentLoaded', () => {
    // --- Search Functionality ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) {
        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                const found = window.find(query, false, false, true, false, false, false);

                if (!found) {
                    window.getSelection().removeAllRanges();
                    const foundAgain = window.find(query, false, false, true, false, false, false);
                    if (!foundAgain) {
                        alert(`"${query}" not found.`);
                    }
                }
            }
        }

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // --- Testimonial Carousel ---
    let slideIndex = 1;
    const slides = document.getElementsByClassName("testimonial-slide");
    const dots = document.getElementsByClassName("dot");

    // Only run if slides exist
    if (slides.length > 0) {
        showSlides(slideIndex);

        // Auto play every 5 seconds
        let slideInterval = setInterval(() => {
            plusSlides(1);
        }, 5000);

        // Make functions available properly or attach listeners
        // Attaching listeners to dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', () => {
                currentSlide(i + 1);
                resetInterval();
            });
        }

        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        function currentSlide(n) {
            showSlides(slideIndex = n);
        }

        function showSlides(n) {
            let i;
            if (n > slides.length) { slideIndex = 1 }
            if (n < 1) { slideIndex = slides.length }

            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
                slides[i].classList.remove("active");
            }

            for (i = 0; i < dots.length; i++) {
                dots[i].classList.remove("active");
            }

            // Show current slide
            // Note: We use flex based on CSS class, but we need to override the display:none loop above
            // Actually, simply toggling the class 'active' handles the display property in our CSS
            // So we can just rely on the class.

            // Re-loop to clear inline styles if any set by JS previously? 
            // Better logic based on CSS class:
            for (i = 0; i < slides.length; i++) {
                slides[i].classList.remove("active");
                // Currently CSS handles display:none for non-active and display:flex for active
                // But the loop above set style.display = "none". Let's clear that.
                slides[i].style.display = "";
            }

            slides[slideIndex - 1].classList.add("active");
            dots[slideIndex - 1].classList.add("active");
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                plusSlides(1);
            }, 5000);
        }
    }
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursorDot) {
        // Move cursor with mouse
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        // Hover effect for interactive elements
        // Select buttons, links, and inputs
        const interactiveElements = document.querySelectorAll('a, button, .btn, input[type="submit"], input[type="text"], textarea');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-hover');

                // Optional: To strictly "dissolve in that button color", we could grab the color
                // const computedStyle = window.getComputedStyle(el);
                // cursorDot.style.backgroundColor = computedStyle.backgroundColor;
                // But user said "dissolve *in*", implying expanding/disappearing into it.
                // The CSS .cursor-hover { opacity: 0; transform: scale(...) } handles the visual "dissolve".
            });

            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-hover');
                // Reset color if we changed it
                // cursorDot.style.backgroundColor = ''; 
            });
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    // --- Creatives Expand/Collapse Logic ---
    window.toggleCreatives = function () {
        const wrapper = document.getElementById('creativesWrapper');
        const footer = document.getElementById('creativesFooter');

        if (wrapper) {
            wrapper.classList.toggle('expanded');

            if (wrapper.classList.contains('expanded')) {
                if (footer) footer.style.display = 'block';
            } else {
                if (footer) footer.style.display = 'none';
                // Scroll back to the top of the creatives section smoothly when collapsing
                const sectionHeight = wrapper.parentElement.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: sectionHeight, behavior: 'smooth' });
            }
        }
    };
    // --- Videos Expand/Collapse Logic ---
    window.toggleVideos = function () {
        const wrapper = document.getElementById('videosWrapper');
        const footer = document.getElementById('videosFooter');

        if (wrapper) {
            wrapper.classList.toggle('expanded');

            if (wrapper.classList.contains('expanded')) {
                if (footer) footer.style.display = 'block';
            } else {
                if (footer) footer.style.display = 'none';
                const sectionHeight = wrapper.parentElement.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: sectionHeight, behavior: 'smooth' });
            }
        }
    };

    // --- Unified Media Expansion Modal Logic ---
    window.openMedia = function (item) {
        const modal = document.getElementById('mediaModal');
        const container = document.getElementById('mediaModalContainer');
        const mediaElement = item.querySelector('video') || item.querySelector('img');

        if (modal && container && mediaElement) {
            container.innerHTML = '';
            const clone = mediaElement.cloneNode(true);

            // Interaction settings
            clone.style.pointerEvents = 'auto';
            if (clone.tagName === 'VIDEO') {
                clone.controls = true;
                clone.muted = false;
            } else {
                // If image, ensure it scales correctly inside the modal
                clone.style.maxWidth = '100%';
                clone.style.maxHeight = '90vh';
                clone.style.objectFit = 'contain';
                clone.style.borderRadius = '8px';
            }

            container.appendChild(clone);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            if (clone.tagName === 'VIDEO') {
                clone.play().catch(e => console.log("Auto-play prevented on modal open", e));
            }
        }
    };

    window.closeMedia = function () {
        const modal = document.getElementById('mediaModal');
        const container = document.getElementById('mediaModalContainer');

        if (modal && container) {
            const video = container.querySelector('video');
            if (video) video.pause(); // stop audio

            modal.classList.remove('show');
            container.innerHTML = '';
            document.body.style.overflow = '';
        }
    };

    // --- ESC Key to Close Media Modal ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMedia();
        }
    });

    // --- Intersection Observer to Pause Off-Screen Videos ---
    if ('IntersectionObserver' in window) {
        const videos = document.querySelectorAll('video');
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.hasAttribute('autoplay')) {
                        entry.target.play().catch(e => console.log("Auto-play prevented", e));
                    }
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.1 });

        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }
});
