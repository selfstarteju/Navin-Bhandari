// --- DOM Elements ---
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const bookingModal = document.getElementById('bookingModal'); // Renamed from 'modal' for clarity
const closeBookingModalBtn = document.querySelector('.close-button'); // Updated selector
const bookingPackageSelect = document.getElementById('bookingPackage'); // For the dropdown in the modal
const continueToFormButton = document.getElementById('continueToFormButton'); // New button in modal

// --- Google Form Link ---
// ** IMPORTANT: Replace this with your actual Google Form link **
const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLScy39WL2FZgVVXQ-IC-BiS1t9zs3Q5DqZZ5Q1mXJXiX_hzOeA/viewform?usp=sharing"; // Removed &ouid=... as it's not needed for a standard link

// --- Mobile Navigation Toggle ---
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- Smooth scrolling for navigation links ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Adjust offset for fixed navbar
            const offsetTop = targetSection.offsetTop - document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// --- Navbar scroll effect ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// --- Gallery Filter Functionality ---
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease'; // Ensure fadeIn animation is defined in CSS
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// --- Booking Modal Functions ---
function openBookingModal() {
    bookingModal.style.display = 'flex'; // Use flex to center, as per updated CSS
    bookingModal.classList.add('active'); // For CSS transition
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
}

function closeBookingModal() {
    bookingModal.classList.remove('active'); // For CSS transition
    // Wait for animation to complete before setting display to none
    setTimeout(() => {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    }, 300); // Match this duration with your CSS transition duration
}

// Modal event listeners
closeBookingModalBtn.addEventListener('click', closeBookingModal); // Updated variable name

window.addEventListener('click', (e) => {
    if (e.target === bookingModal) { // Check if click is on the modal backdrop
        closeBookingModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        closeBookingModal();
    }
});

// --- Package Selection Function ---
function selectPackage(packageName) {
    openBookingModal();

    // Reset dropdown to default first to handle general 'Book Now'
    bookingPackageSelect.value = "";

    // Set the selected package in the modal's dropdown
    let found = false;
    for (let option of bookingPackageSelect.options) {
        if (option.text.includes(packageName)) {
            option.selected = true;
            found = true;
            break;
        }
    }
    // If a specific package wasn't found (e.g., from a general "Book Now" button),
    // ensure the default "Choose a package" is selected.
    if (!found) {
        bookingPackageSelect.value = "";
    }
}

// Event listener for the "Continue to Booking Form" button inside the modal
continueToFormButton.addEventListener('click', () => {
    const selectedPackageText = bookingPackageSelect.options[bookingPackageSelect.selectedIndex].text;

    let finalFormLink = GOOGLE_FORM_LINK;

    // Optional: Attempt to pre-fill a specific field in Google Form.
    // This requires knowing the 'entry.xxxxxxxxxx' ID of the Google Form question.
    // To get the entry ID:
    // 1. Open your Google Form in edit mode.
    // 2. Click the 'Send' button.
    // 3. Click the 'Link' icon.
    // 4. Click 'Get pre-filled link'.
    // 5. Fill out the field you want to pre-fill (e.g., "Which package are you interested in?")
    // 6. Click 'Get link' at the bottom.
    // 7. Copy the link. Look for `entry.xxxxxxxxxx=YourPreFilledValue`. The `xxxxxxxxxx` is your ID.
    // Example: If your question is "Which package are you interested in?" and its ID is 1234567890
    // finalFormLink += `&entry.1234567890=${encodeURIComponent(selectedPackageText)}`;

    // Open the Google Form in a new tab
    window.open(finalFormLink, '_blank');
    closeBookingModal(); // Close your modal
});

// --- Notification Function ---
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation (moved to script.js for encapsulation if not in main CSS)
// It's generally better to keep all CSS in a .css file, but for demonstration,
// I'll keep it here as it was in your provided code.
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
`;
document.head.appendChild(style);

// --- Intersection Observer for animations ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about, .gallery, .packages, .offers, .contact');
    animateElements.forEach(el => observer.observe(el));
});

// --- Lazy loading for images ---
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // Check if dataset.src exists, otherwise use current src (for non-lazy images)
            if (img.dataset.src) {
                 img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

// Observe all images that might be lazy-loaded (you'd need to add data-src attribute to them in HTML)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]'); // Only observe images with data-src
    images.forEach(img => imageObserver.observe(img));
});


// --- Form validation ---
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Allows for +, spaces, hyphens, and digits, minimum 10 digits
    const re = /^[+]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Add real-time validation to form inputs
const emailInputs = document.querySelectorAll('input[type="email"]');
const phoneInputs = document.querySelectorAll('input[type="tel"]');

emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validateEmail(input.value)) {
            input.style.borderColor = '#e74c3c';
            showNotification('Please enter a valid email address', 'error');
        } else {
            input.style.borderColor = '#e9ecef'; // Reset to default
        }
    });
});

phoneInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validatePhone(input.value)) {
            input.style.borderColor = '#e74c3c';
            showNotification('Please enter a valid phone number (min 10 digits)', 'error');
        } else {
            input.style.borderColor = '#e9ecef'; // Reset to default
        }
    });
});

// --- Scroll to top functionality ---
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex; /* Changed to flex to center icon */
    justify-content: center; /* Center icon */
    align-items: center; /* Center icon */
    opacity: 0; /* Start hidden */
    visibility: hidden; /* Start hidden */
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Initialize everything when DOM is loaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body for initial fade-in (if you have CSS for it)
    document.body.classList.add('loading');

    // Set minimum date for a hypothetical booking date input (if you add one to your modal later)
    // const dateInput = document.getElementById('bookingDate');
    // if (dateInput) {
    //     const today = new Date().toISOString().split('T')[0];
    //     dateInput.min = today;
    // }

    console.log('Navin Bhandari Photography website loaded successfully!');
});

// --- Performance optimization ---
window.addEventListener('load', () => {
    // Remove loading states
    document.body.classList.remove('loading');

    // Preload critical images (if you want to implement this, update paths)
    // const criticalImages = [
    //     'path/to/your/hero-image.jpg',
    //     'path/to/your/logo.png'
    // ];

    // criticalImages.forEach(src => {
    //     const img = new Image();
    //     img.src = src;
    // });
});

// --- Error handling ---
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // In production, you might want to send this to an error tracking service
    showNotification('An unexpected error occurred. Please try again.', 'error');
});

// --- Service Worker registration (for PWA capabilities) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope: ', registration.scope);
            })
            .catch(registrationError => {
                console.log('Service Worker registration failed: ', registrationError);
            });
    });
}
