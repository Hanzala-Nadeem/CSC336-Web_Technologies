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


$(document).ready(function () {

  $.ajax({
    url: 'https://fakestoreapi.com/products?limit=4',
    method: 'GET',
    success: function (products) {

      const grid = $('#featured-deals');
      grid.empty();

      products.forEach(function (product) {

        // fakestoreapi returns "image" as a plain string — not images[]
        const image = product.image || 'https://placehold.co/400x300/f0f0f0/000?text=No+Image';
        const title = product.title;
        const price = '$' + product.price;
        const category = product.category || 'General';
        const desc = product.description?.replace(/"/g, '&quot;') || 'No description available.';
        const rating = product.rating?.rate || 'N/A';
        const reviews = product.rating?.count || 0;

        const card = `
          <div class="product-card">
            <div class="product-image">
              <button class="wishlist-btn" onclick="toggleWishlist(this)">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.7206 6H11.7071L16 10.2929L20.2929 6H25.2794L29.6328 13.0743L16 26.7071
                       L2.36719 13.0743L6.7206 6ZM7.2794 7L3.63281 12.9257L16 25.2929L28.3672
                       12.9257L24.7206 7H20.7071L16 11.7071L11.2929 7H7.2794Z" fill="black"/>
                </svg>
              </button>
              <img src="${image}" alt="${title}"
                onerror="this.src='https://placehold.co/400x300/f0f0f0/000?text=No+Image'">
              <button class="quick-view-btn"
                data-title="${title}"
                data-price="${price}"
                data-desc="${desc}"
                data-img="${image}"
                data-rating="${rating} ⭐ (${reviews} reviews)">
                Quick View
              </button>
            </div>
            <div class="product-info">
              <p class="price">${price}</p>
              <h4>${title}</h4>
              <p class="category">${category}</p>
            </div>
          </div>`;

        grid.append(card);
      });

      // Quick View click handler
      $('#featured-deals').on('click', '.quick-view-btn', function () {
        const btn = $(this);
        $('#modal-title').text(btn.data('title'));
        $('#modal-price').text(btn.data('price'));
        $('#modal-desc').text(btn.data('desc'));
        $('#modal-img').attr('src', btn.data('img'));
        $('#modal-rating').text(btn.data('rating'));
        $('#quick-view-modal').fadeIn(200);
        $('body').css('overflow', 'hidden');
      });

    },
    error: function () {
      $('#featured-deals').html('<p style="padding:20px;color:#888;">Could not load deals right now.</p>');
    }
  });

  // Close modal
  $(document).on('click', '#modal-close, #quick-view-modal', function (e) {
    if (e.target === this) {
      $('#quick-view-modal').fadeOut(200);
      $('body').css('overflow', '');
    }
  });

});