// Gallery data - will store all media items
let galleryItems = [];
let currentFilter = 'all';
let currentLightboxIndex = 0;

// File extensions
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
const videoExtensions = ['mov', 'mp4', 'avi', 'webm', 'mkv'];

// Load existing files from the iCloud Photos directory
async function loadExistingFiles() {
    // Pre-populate with the files we know exist
    const existingFiles = [
        '923fac29-19ab-45ea-b07f-e256b7b5dacd.jpg',
        'IMG_0426.JPG',
        'IMG_0430.JPEG',
        'IMG_0442.JPG',
        'IMG_0446.JPEG',
        'IMG_0457.JPEG',
        'IMG_0461.JPEG',
        'IMG_0462.JPEG',
        'IMG_0463.JPEG',
        'IMG_0466.JPEG',
        'IMG_0470.JPEG',
        'IMG_0475.JPEG',
        'IMG_0476.JPEG',
        'IMG_0481.JPEG',
        'IMG_0483.JPEG',
        'IMG_0486.JPEG',
        'IMG_0490.JPEG',
        'IMG_0494.JPEG',
        'IMG_0501.JPEG',
        'IMG_0512.JPEG',
        'IMG_0531.JPEG',
        'IMG_0535.JPG',
        'IMG_0984.JPEG'
    ];

    existingFiles.forEach(filename => {
        const ext = filename.split('.').pop().toLowerCase();
        const type = videoExtensions.includes(ext) ? 'video' : 'image';
        
        galleryItems.push({
            name: filename,
            path: `iCloud Photos/${filename}`,
            type: type
        });
    });

    renderGallery();
}

// Determine if file is image or video
function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (imageExtensions.includes(ext)) return 'image';
    if (videoExtensions.includes(ext)) return 'video';
    return 'unknown';
}

// Render gallery
function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    const filteredItems = galleryItems.filter(item => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'images') return item.type === 'image';
        if (currentFilter === 'videos') return item.type === 'video';
        return true;
    });
    
    filteredItems.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', galleryItems.indexOf(item));
        
        if (item.type === 'video') {
            galleryItem.innerHTML = `
                <video>
                    <source src="${item.path}" type="video/quicktime">
                    <source src="${item.path}" type="video/mp4">
                </video>
                <div class="video-badge">▶ Video</div>
                <div class="overlay">
                    <span class="item-name">MVP Summit 2025</span>
                </div>
            `;
        } else {
            galleryItem.innerHTML = `
                <img src="${item.path}" alt="${item.name}">
                <div class="overlay">
                    <span class="item-name">MVP Summit 2025</span>
                </div>
            `;
        }
        
        galleryItem.addEventListener('click', () => openLightbox(galleryItems.indexOf(item)));
        gallery.appendChild(galleryItem);
    });
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        renderGallery();
    });
});

// Lightbox functionality
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const item = galleryItems[index];
    
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const caption = document.querySelector('.lightbox-caption');
    
    if (item.type === 'video') {
        img.style.display = 'none';
        video.style.display = 'block';
        video.querySelector('source').src = item.path;
        video.load();
    } else {
        video.style.display = 'none';
        img.style.display = 'block';
        img.src = item.path;
    }
    
    caption.textContent = item.name;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const video = document.getElementById('lightbox-video');
    video.pause();
    lightbox.classList.remove('active');
}

function navigateLightbox(direction) {
    const content = document.querySelector('.lightbox-content');
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    
    // Add exit animation
    content.style.animation = direction === 1 ? 'slideOutLeft 0.3s ease' : 'slideOutRight 0.3s ease';
    
    setTimeout(() => {
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) currentLightboxIndex = galleryItems.length - 1;
        if (currentLightboxIndex >= galleryItems.length) currentLightboxIndex = 0;
        
        const item = galleryItems[currentLightboxIndex];
        
        if (item.type === 'video') {
            img.style.display = 'none';
            video.style.display = 'block';
            video.querySelector('source').src = item.path;
            video.load();
        } else {
            video.style.display = 'none';
            img.style.display = 'block';
            img.src = item.path;
        }
        
        document.querySelector('.lightbox-caption').textContent = item.name;
        
        // Add enter animation
        content.style.animation = direction === 1 ? 'slideInRight 0.3s ease' : 'slideInLeft 0.3s ease';
    }, 300);
}

// Event listeners for lightbox
document.querySelector('.close').addEventListener('click', closeLightbox);
document.querySelector('.prev').addEventListener('click', () => navigateLightbox(-1));
document.querySelector('.next').addEventListener('click', () => navigateLightbox(1));

document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    }
});

// Initialize gallery with existing files
loadExistingFiles();
