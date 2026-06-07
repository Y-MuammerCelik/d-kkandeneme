document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true,
            easing: 'ease-out-cubic'
        });
    }

    // --- MOBILE HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('toggle');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-links li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('toggle');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- PHASE 4: DYNAMIC REVIEWS (LocalStorage) ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    let swiperInstance = null;

    // Seed Data (if no data in LocalStorage)
    const seedReviews = [
        {
            name: "Ahmet K., Arsin",
            text: "Televizyonumun ekranı aniden kararmıştı. Serdar Usta aynı gün gelip evden aldı, ertesi gün tamir edilmiş şekilde tertemiz teslim etti. Hızlı ve güvenilir.",
            rating: 5,
            timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
            name: "Merve T., Yomra",
            text: "Çanak anten montajı için çağırdık. Hem çok uygun fiyata yaptı hem de kabloları gizleyerek çok temiz çalıştı. Kesinlikle tavsiye ederim.",
            rating: 5,
            timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
            name: "Caner B., Trabzon Merkez",
            text: "Dükkana ses sistemi kurulumu için anlaştık. İşini gerçekten severek ve bilerek yapıyor. Garantili hizmet vermesi de ayrıca güven verici.",
            rating: 4,
            timestamp: Date.now() - (30 * 24 * 60 * 60 * 1000) // ~1 month ago
        }
    ];

    // Load from LocalStorage or use seed
    let reviews = JSON.parse(localStorage.getItem('serdarReviews'));
    if (!reviews) {
        reviews = seedReviews;
        localStorage.setItem('serdarReviews', JSON.stringify(reviews));
    }

    // Helper: Calculate relative time
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " yıl önce";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " ay önce";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " gün önce";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " saat önce";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " dakika önce";
        return "Az önce";
    };

    // Helper: Generate Stars HTML
    const getStarsHtml = (rating) => {
        let stars = '';
        for(let i=0; i<5; i++) {
            stars += i < rating ? '★' : '☆';
        }
        return stars;
    };

    // Render Reviews
    const renderReviews = () => {
        if (!reviewsContainer) return;
        
        // Sort newest first
        reviews.sort((a, b) => b.timestamp - a.timestamp);
        
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="stars">${getStarsHtml(review.rating)}</div>
                    <p class="testimonial-text">"${review.text}"</p>
                    <p class="testimonial-author">- ${review.name}</p>
                    <span class="review-time">${timeAgo(review.timestamp)}</span>
                </div>
            `;
            reviewsContainer.appendChild(slide);
        });

        // Initialize or update Swiper
        if (typeof Swiper !== 'undefined') {
            if (swiperInstance) {
                swiperInstance.destroy(true, true);
            }
            swiperInstance = new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }
    };

    // Initial render
    if(reviewsContainer) {
        renderReviews();
    }

    // Handle Form Submit
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value;
            const text = document.getElementById('reviewText').value;
            const rating = document.querySelector('input[name="rating"]:checked').value;

            const newReview = {
                name: name,
                text: text,
                rating: parseInt(rating),
                timestamp: Date.now()
            };

            reviews.push(newReview);
            localStorage.setItem('serdarReviews', JSON.stringify(reviews));

            // Close modal
            document.getElementById('modalOverlay').classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('modal-add-review').style.display = 'none';

            // Clear form
            reviewForm.reset();

            // Re-render
            renderReviews();
            
            // Show brief success alert
            alert("Yorumunuz başarıyla eklendi! Teşekkür ederiz.");
        });
    }

    // 3. Fly Menu Logic
    const flyToggleButton = document.getElementById("flyToggleButton");
    const flyMenu = document.getElementById("flyMenu");
    const closeMenuBtn = document.getElementById("closeMenuBtn");

    if(flyToggleButton && flyMenu && closeMenuBtn) {
        flyToggleButton.addEventListener("click", (e) => {
            e.preventDefault();
            flyMenu.classList.add("open");
        });

        closeMenuBtn.addEventListener("click", () => {
            flyMenu.classList.remove("open");
        });
    }

    // 4. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if(question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const icon = otherItem.querySelector('.faq-icon');
                    if(icon) icon.textContent = '+';
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    const icon = item.querySelector('.faq-icon');
                    if(icon) icon.textContent = '-';
                }
            });
        }
    });

    // 5. Distance & Time Calculator Logic
    const calcBtn = document.getElementById('calculateDistanceBtn');
    const calcResult = document.getElementById('calcResult');
    const shopLat = 40.9450;
    const shopLon = 39.9320;

    if (calcBtn && calcResult) {
        calcBtn.addEventListener('click', () => {
            calcResult.innerHTML = '<span style="color:#aaa;">Konumunuz bulunuyor, lütfen bekleyin...</span>';

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;
                        
                        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${shopLon},${shopLat}?overview=false`;

                        fetch(osrmUrl)
                            .then(response => response.json())
                            .then(data => {
                                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                                    const distanceMeters = data.routes[0].distance;
                                    const durationSeconds = data.routes[0].duration;

                                    const distanceKm = (distanceMeters / 1000).toFixed(1);
                                    const durationMinutes = Math.ceil(durationSeconds / 60);

                                    calcResult.innerHTML = `
                                        🚗 Size olan uzaklığımız: <strong>${distanceKm} km</strong><br>
                                        ⏱️ Tahmini servis varış süresi: <strong>${durationMinutes} dakika</strong>
                                    `;
                                } else {
                                    calcResult.innerHTML = '<span style="color:#ff3366;">Mesafe hesaplanamadı. Yol tarifi alınamıyor.</span>';
                                }
                            })
                            .catch(error => {
                                console.error('OSRM API Error:', error);
                                calcResult.innerHTML = '<span style="color:#ff3366;">Hesaplama servisine şu an ulaşılamıyor.</span>';
                            });
                    },
                    error => {
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                calcResult.innerHTML = '<span style="color:#ff3366;">Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.</span>';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                calcResult.innerHTML = '<span style="color:#ff3366;">Konum bilgisine şu an ulaşılamıyor.</span>';
                                break;
                            case error.TIMEOUT:
                                calcResult.innerHTML = '<span style="color:#ff3366;">Konum alma isteği zaman aşımına uğradı.</span>';
                                break;
                            default:
                                calcResult.innerHTML = '<span style="color:#ff3366;">Bilinmeyen bir hata oluştu.</span>';
                        }
                    },
                    { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
                );
            } else {
                calcResult.innerHTML = '<span style="color:#ff3366;">Tarayıcınız konum servisini desteklemiyor.</span>';
            }
        });
    }

    // 6. Modals Logic
    const openModalBtns = document.querySelectorAll('[data-modal-target]');
    const closeModals = document.querySelectorAll('.close-modal');
    const overlay = document.getElementById('modalOverlay');

    if (overlay) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                
                // Hide all modals first
                document.querySelectorAll('.service-modal').forEach(m => m.style.display = 'none');
                
                // Show requested modal
                if(modal) {
                    modal.style.display = 'block';
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });

        const closeModal = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                document.querySelectorAll('.service-modal').forEach(m => m.style.display = 'none');
            }, 300); // Wait for transition
        };

        closeModals.forEach(btn => btn.addEventListener('click', closeModal));
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) closeModal();
        });
    }

    // 7. Before/After Slider Logic
    const baSlider = document.getElementById('baSlider');
    const baBeforeImage = document.getElementById('baBeforeImage');
    const baSliderLine = document.getElementById('baSliderLine');
    const baSliderButton = document.getElementById('baSliderButton');

    if (baSlider && baBeforeImage && baSliderLine && baSliderButton) {
        baSlider.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            baBeforeImage.style.width = `${sliderValue}%`;
            baSliderLine.style.left = `${sliderValue}%`;
            baSliderButton.style.left = `${sliderValue}%`;
        });
    }
});
