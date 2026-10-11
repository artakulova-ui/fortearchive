// Инициализация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3DBsxPIwYD1XiS9k03nAJT-yYvAKFlIo",
  authDomain: "fortearchive-4e735.firebaseapp.com",
  projectId: "fortearchive-4e735",
  storageBucket: "fortearchive-4e735.firebasestorage.app",
  messagingSenderId: "461596731704",
  appId: "1:461596731704:web:ffb203d6959783f00039cd",
  measurementId: "G-VV5CLT93VR"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let products = [];

// Загрузка товаров из Firestore
async function fetchProductsFromFirebase() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Loading archive...</div>';

    try {
        const snapshot = await db.collection("items").get();
        products = [];

        snapshot.forEach(doc => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Failed to load products.</div>';
    }
}

function getProductImages(product) {
    return Array.isArray(product.images)
        ? product.images.filter(imageUrl => typeof imageUrl === 'string' && imageUrl.trim())
        : [];
}

// Рендер товаров в галерею (берет первое фото из массива как обложку)
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No items found in this category.</div>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModal(product);

        const images = getProductImages(product);

        const stockText = product.status === 'In Stock'
            ? `In Stock (${product.stock || 1})`
            : (product.status || 'Sold Out');

        card.innerHTML = `
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price" style="font-size: 13px; color: ${product.status === 'In Stock' ? '#2e7d32' : '#c62828'};">${stockText}</div>
            </div>
        `;

        if (images.length > 0) {
            const coverImage = document.createElement('img');
            coverImage.src = images[0];
            coverImage.alt = product.title || '';
            card.prepend(coverImage);
        }

        grid.appendChild(card);
    });
}

// Модальное окно с поддержкой галереи нескольких фото
function openModal(product) {
    const images = getProductImages(product);
    const imageContainer = document.querySelector('.modal-image');

    if (imageContainer) {
        imageContainer.replaceChildren();

        if (images.length > 0) {
            const mainImage = document.createElement('img');
            mainImage.id = 'modalImg';
            mainImage.src = images[0];
            mainImage.alt = product.title || '';
            imageContainer.appendChild(mainImage);

            if (images.length > 1) {
                const thumbnails = document.createElement('div');
                thumbnails.style.cssText = 'display:flex;gap:8px;overflow-x:auto;padding-bottom:5px;';

                images.forEach(imageUrl => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = imageUrl;
                    thumbnail.alt = product.title || '';
                    thumbnail.style.cssText = 'width:60px;height:75px;object-fit:cover;cursor:pointer;border:1px solid #ddd;';
                    thumbnail.addEventListener('click', () => {
                        mainImage.src = imageUrl;
                    });
                    thumbnails.appendChild(thumbnail);
                });

                imageContainer.appendChild(thumbnails);
            }
        }
    }

    document.getElementById('modalTitle').innerText = product.title || '';
    document.getElementById('modalCategory').innerText = product.category || '';

    const modalStockText = product.status === 'In Stock'
        ? `Status: In Stock — Qty: ${product.stock || 1}`
        : `Status: ${product.status || 'Sold Out'}`;
    document.getElementById('modalPrice').innerText = modalStockText;

    document.getElementById('modalDesc').innerText = product.description || '';
    document.getElementById('modalSize').innerText = product.size || '';
    document.getElementById('productModal').style.display = 'flex';
}

// Фильтрация по категориям
function filterCategory(category) {
    // Обновление активной кнопки
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
        renderProducts(filtered);
    }
}

// Переключение разделов (Archive / Payment / Contact)
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Переход со страницы товара к разделу Контактов
function inquireProduct() {
    closeModal();
    showSection('contact');
    window.location.hash = 'contact';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchProductsFromFirebase();
});