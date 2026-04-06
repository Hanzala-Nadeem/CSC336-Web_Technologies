let lastScrollTop = 0;
const header = document.getElementById('main-header');

function slide(gridId, direction) {
    const grid = document.getElementById(gridId);
    const cardWidth = grid.querySelector('.product-card').offsetWidth + 16;
    grid.scrollLeft += direction * cardWidth;
}

function toggleWishlist(btn) {
    btn.classList.toggle('active');
}

function updateScrollbar(gridId, thumbId) {
    const grid = document.getElementById(gridId);
    const thumb = document.getElementById(thumbId);
    const scrollRatio = grid.scrollLeft / (grid.scrollWidth - grid.clientWidth);
    thumb.style.left = (scrollRatio * 75) + '%';
}

function trackClick(e, gridId, thumbId) {
    const track = e.currentTarget;
    const clickX = e.offsetX / track.offsetWidth;
    const grid = document.getElementById(gridId);
    grid.scrollLeft = clickX * (grid.scrollWidth - grid.clientWidth);
    updateScrollbar(gridId, thumbId);
}

function slideS(gridId, direction) {
    const grid = document.getElementById(gridId);
    const cardWidth = grid.querySelector('.sport-card').offsetWidth + 4;
    grid.scrollLeft += direction * cardWidth;
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('menu-backdrop');
    menu.classList.toggle('open');
    backdrop.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// Hide/Show Header on Scroll
window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scrolling DOWN - Hide header
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.3s ease';
    } else {
        // Scrolling UP - Show header
        header.style.transform = 'translateY(0)';
        header.style.transition = 'transform 0.3s ease';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
