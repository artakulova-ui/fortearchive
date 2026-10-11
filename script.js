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
        const snapshot = await db.collection("products").get();
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

        // Берем первое фото из массива images, либо fallback, либо старое поле image если оно осталось
        const coverImage = (Array.isArray(product.images) && product.images.length > 0)
            ? product.images[0]
            : (product.image || 'https://via.placeholder.com/400x500?text=FORTE');

        const stockText = product.status === 'In Stock'
            ? `In Stock (${product.stock || 1})`
            : (product.status || 'Sold Out');

        card.innerHTML = `
            <img src="${coverImage}" alt="${product.title}">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price" style="font-size: 13px; color: ${product.status === 'In Stock' ? '#2e7d32' : '#c62828'};">${stockText}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Модальное окно с поддержкой галереи нескольких фото
function openModal(product) {
    // Собираем массив картинок (поддерживаем и новый массив images, и старое поле image)
    let imgs = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        imgs = product.images;
    } else if (product.image) {
        imgs = [product.image];
    } else {
        imgs = ['https://via.placeholder.com/400x500?text=FORTE'];
    }

    // Рендерим главное фото и миниатюры (или список фото) в модалке
    // Если на вашей странице modalImg — это просто тег <img>, мы можем заменить его контейнером галереи
    const modalImageElement = document.getElementById('modalImg');
    modalImageElement.src = imgs[0]; // Первое фото по умолчанию

    // Если у товара несколько фото, выводим их вертикально или горизонтально под главным
    let galleryHtml = `<img id="modalImg" src="${imgs[0]}" alt="${product.title}" style="width:100%; display:block; margin-bottom: 10px;">`;

    if (imgs.length > 1) {
        galleryHtml += `<div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px;">`;
        imgs.forEach((imgUrl) => {
            galleryHtml += `<img src="${imgUrl}" onclick="document.getElementById('modalImg').src='${imgUrl}'" style="width: 60px; height: 75px; object-fit: cover; cursor: pointer; border: 1px solid #ddd; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#000'" onmouseout="this.style.borderColor='#ddd'">`;
        });
        galleryHtml += `</div>`;
    }

    // Вставляем галерею внутрь контейнера картинки в модалке
    const imgWrapper = modalImageElement.closest('.modal-image-container') || modalImageElement.parentElement;
    imgWrapper.innerHTML = galleryHtml;

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