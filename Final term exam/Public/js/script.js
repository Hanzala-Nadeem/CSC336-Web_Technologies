// ===================================================
// HOMEPAGE FUNCTIONS
// ===================================================

function slide(gridId, direction) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const card = grid.querySelector('.product-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    grid.scrollLeft += direction * cardWidth;
}

function toggleWishlist(btn) {
    btn.classList.toggle('active');
}

function updateScrollbar(gridId, thumbId) {
    const grid = document.getElementById(gridId);
    const thumb = document.getElementById(thumbId);
    if (!grid || !thumb) return;
    const scrollRatio = grid.scrollLeft / (grid.scrollWidth - grid.clientWidth);
    thumb.style.left = (scrollRatio * 75) + '%';
}

function trackClick(e, gridId, thumbId) {
    const track = e.currentTarget;
    const clickX = e.offsetX / track.offsetWidth;
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.scrollLeft = clickX * (grid.scrollWidth - grid.clientWidth);
    updateScrollbar(gridId, thumbId);
}

function slideS(gridId, direction) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const card = grid.querySelector('.sport-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 4;
    grid.scrollLeft += direction * cardWidth;
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('menu-backdrop');
    if (!menu || !backdrop) return;
    menu.classList.toggle('open');
    backdrop.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// Hide/Show Header on Scroll
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (!header) return;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.3s ease';
    } else {
        header.style.transform = 'translateY(0)';
        header.style.transition = 'transform 0.3s ease';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});


// ===================================================
// PRODUCTS PAGE FUNCTIONS
// ===================================================

// ── Filter Sidebar ──
function toggleFilterSidebar() {
    const sidebar = document.getElementById('filterSidebar');
    const backdrop = document.getElementById('filterBackdrop');
    if (!sidebar || !backdrop) return;

    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

// ── Filter Section Accordion ──
function toggleFilterSection(btn) {
    const body = btn.nextElementSibling;
    btn.classList.toggle('collapsed');
    body.classList.toggle('open');
}

// ── Search with Autocomplete ──
(function() {
    const searchInput = document.getElementById('productSearchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    if (!searchInput || !suggestionsBox) return;

    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        const query = this.value.trim();

        if (query.length < 2) {
            suggestionsBox.classList.remove('active');
            suggestionsBox.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(function() {
            fetch('/products/suggestions?q=' + encodeURIComponent(query))
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data.length === 0) {
                        suggestionsBox.classList.remove('active');
                        suggestionsBox.innerHTML = '';
                        return;
                    }

                    let html = '';
                    data.forEach(function(item) {
                        html += '<a class="suggestion-item" href="/products?search=' + encodeURIComponent(item.name) + '">'
                             + '<img src="/' + item.image + '" alt="' + item.name + '">'
                             + '<div class="suggestion-info">'
                             + '<p class="s-name">' + item.name + '</p>'
                             + '<p class="s-price">$' + item.price + '</p>'
                             + '</div>'
                             + '</a>';
                    });

                    suggestionsBox.innerHTML = html;
                    suggestionsBox.classList.add('active');
                })
                .catch(function() {
                    suggestionsBox.classList.remove('active');
                });
        }, 300);
    });

    // Submit search on Enter
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                window.location.href = '/products?search=' + encodeURIComponent(query);
            }
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.remove('active');
        }
    });
})();


// ── Quick View Modal ──
var currentProductId = null;

function openQuickView(productId) {
    currentProductId = productId;
    fetch('/products/' + productId)
        .then(function(res) { return res.json(); })
        .then(function(product) {
            if (product.error) return;

            document.getElementById('qv-image').src = '/' + product.image;
            document.getElementById('qv-image').alt = product.name;
            document.getElementById('qv-name').textContent = product.name;
            document.getElementById('qv-price').textContent = '$' + product.price;
            document.getElementById('qv-category').textContent = (product.category && product.category.name ? product.category.name : product.category) + ' · ' + (product.collection || 'Originals');
            document.getElementById('qv-description').textContent = product.description || 'No description available.';

            // Rating stars
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(product.rating)) {
                    starsHtml += '<span class="star filled">★</span>';
                } else if (i - 0.5 <= product.rating) {
                    starsHtml += '<span class="star half">★</span>';
                } else {
                    starsHtml += '<span class="star">☆</span>';
                }
            }
            starsHtml += ' <span class="rating-num">' + product.rating + '</span>';
            document.getElementById('qv-rating').innerHTML = starsHtml;

            // Stock status
            const stockEl = document.getElementById('qv-stock');
            if (product.stock <= 0) {
                stockEl.textContent = 'Out of Stock';
                stockEl.className = 'qv-stock out-of-stock';
            } else if (product.stock <= 20) {
                stockEl.textContent = 'Only ' + product.stock + ' left in stock!';
                stockEl.className = 'qv-stock low-stock';
            } else {
                stockEl.textContent = 'In Stock (' + product.stock + ' available)';
                stockEl.className = 'qv-stock in-stock';
            }

            // Enable/disable add to bag button
            var addBtn = document.querySelector('.qv-add-btn');
            if (addBtn) {
                if (product.stock <= 0) {
                    addBtn.disabled = true;
                    addBtn.textContent = 'OUT OF STOCK';
                    addBtn.style.background = '#ccc';
                    addBtn.style.cursor = 'not-allowed';
                } else {
                    addBtn.disabled = false;
                    addBtn.textContent = 'ADD TO BAG';
                    addBtn.style.background = '#000';
                    addBtn.style.cursor = 'pointer';
                }
            }

            document.getElementById('quickviewModal').classList.add('open');
            document.getElementById('quickviewBackdrop').classList.add('open');
            document.body.style.overflow = 'hidden';
        })
        .catch(function(err) {
            console.error('Quick view error:', err);
        });
}

function closeQuickView() {
    document.getElementById('quickviewModal').classList.remove('open');
    document.getElementById('quickviewBackdrop').classList.remove('open');
    document.body.style.overflow = '';
    currentProductId = null;
}

// ── Add to Bag (AJAX) ──
function addToBag() {
    if (!currentProductId) return;

    var btn = document.querySelector('.qv-add-btn');
    if (btn) {
        btn.textContent = 'ADDING...';
        btn.disabled = true;
    }

    fetch('/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: currentProductId, quantity: 1 })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success) {
            // Update cart badge in header
            var badges = document.querySelectorAll('.cart-badge-count');
            badges.forEach(function(b) { b.textContent = data.cartCount; b.style.display = 'flex'; });

            // Show toast notification
            showToast(data.message);

            if (btn) {
                btn.textContent = '✓ ADDED';
                btn.style.background = '#00a651';
                setTimeout(function() {
                    btn.textContent = 'ADD TO BAG';
                    btn.style.background = '#000';
                    btn.disabled = false;
                }, 1500);
            }
        } else {
            showToast(data.message || 'Error adding to bag');
            if (btn) { btn.textContent = 'ADD TO BAG'; btn.disabled = false; }
        }
    })
    .catch(function(err) {
        console.error('Add to bag error:', err);
        showToast('Error adding to bag');
        if (btn) { btn.textContent = 'ADD TO BAG'; btn.disabled = false; }
    });
}

// ── Toast Notification ──
function showToast(message) {
    var existing = document.getElementById('cart-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:14px 28px;font-size:0.85rem;font-weight:600;letter-spacing:1px;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,0.3);opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.opacity = '1'; }, 10);
    setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
}

// Wire up ADD TO BAG buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('qv-add-btn')) {
        e.preventDefault();
        addToBag();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeQuickView();
        // Also close filter sidebar if open
        var sidebar = document.getElementById('filterSidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            toggleFilterSidebar();
        }
    }
});
