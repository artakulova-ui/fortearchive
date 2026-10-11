// Список товаров Cop Copine (добавляйте новые вещи сюда)
const products = [
    {
        id: 1,
        title: "Cop Copine Mesh Printed Top",
        category: "tops",
        price: "$85",
        size: "S / M",
        image: "https://via.placeholder.com/400x500?text=Top+1", // Замените на путь к вашему фото
        description: "Vintage Cop Copine mesh long sleeve top with surrealist print. Good condition."
    },
    {
        id: 2,
        title: "Cop Copine Structured Blazer",
        category: "jackets",
        price: "$140",
        size: "M",
        image: "https://via.placeholder.com/400x500?text=Jacket+1",
        description: "Architectural vintage jacket with unique asymmetrical buttons."
    },
    {
        id: 3,
        title: "Cop Copine Asymmetric Midi Dress",
        category: "dresses",
        price: "$120",
        size: "S",
        image: "https://via.placeholder.com/400x500?text=Dress+1",
        description: "Classic Y2K Cop Copine layered dress. Lightweight material."
    },
    {
        id: 4,
        title: "Cop Copine Utility Cargo Trousers",
        category: "trousers",
        price: "$110",
        size: "38 EU",
        image: "https://via.placeholder.com/400x500?text=Trousers+1",
        description: "Grey technical trousers with functional zip pockets."
    }
];

// Рендер товаров в галерею
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModal(product);
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">${product.price}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Фильтрация по категориям
function filterCategory(category) {
    // Обновление активной кнопки
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Переключение разделов (Archive / Payment / Contact)
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Модальное окно (Карточка товара)
function openModal(product) {
    document.getElementById('modalImg').src = product.image;
    document.getElementById('modalTitle').innerText = product.title;
    document.getElementById('modalCategory').innerText = product.category;
    document.getElementById('modalPrice').innerText = product.price;
    document.getElementById('modalDesc').innerText = product.description;
    document.getElementById('modalSize').innerText = product.size;
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});

// Переход со страницы товара к разделу Контактов
function inquireProduct() {
    closeModal();
    showSection('contact');
    window.location.hash = 'contact';
}