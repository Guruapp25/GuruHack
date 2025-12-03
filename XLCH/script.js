const stripeContainer = document.getElementById('stripe-container');
const stripeCount = 5; // Количество полос
const stripeSpacing = 20; // Расстояние между полосами (% от высоты экрана)

// Создаем полосы
for (let i = 0; i < stripeCount; i++) {
    const stripe = document.createElement('div');
    stripe.classList.add('stripe');
    stripe.style.animationDelay = `${i * (stripeSpacing / 100) * 2}s`;
    stripeContainer.appendChild(stripe);
}

// Логика смены GIF
const centerGif = document.getElementById('centerGif');
const startButton = document.getElementById('startButton');
const gifs = ['left.gif', 'right.gif']; // Массив с путями к гифкам

// Добавляем функцию создания облаков
function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';

    // Случайные размеры для разнообразия
    const size = 60 + Math.random() * 40;
    cloud.style.width = size + 'px';
    cloud.style.height = size/2 + 'px';

    // Случайная позиция по вертикали
    cloud.style.top = Math.random() * 60 + '%';

    // Случайная продолжительность анимации
    const duration = 15 + Math.random() * 10;
    cloud.style.animationDuration = duration + 's';

    document.getElementById('cloudContainer').appendChild(cloud);

    // Удаляем облако после завершения анимации
    setTimeout(() => {
        cloud.remove();
    }, duration * 1000);
}

// Создаем новые облака с интервалом
setInterval(createCloud, 3000);

// Создаем начальные облака
for(let i = 0; i < 5; i++) {
    createCloud();
}

let clickCount = 0;
const maxClicks = 11;
const counterContainer = document.getElementById('counterContainer');

// Создаем начальные стрелки
for (let i = 0; i < maxClicks; i++) {
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    counterContainer.appendChild(arrow);
}

// Обновляем обработчик клика кнопки
startButton.addEventListener('click', () => {
    if (clickCount >= maxClicks) return;

    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    centerGif.src = randomGif;
    centerGif.style.width = '320px';
    centerGif.style.height = 'auto';

    // Обновляем стрелку в счетчике
    const arrow = counterContainer.children[clickCount];
    if (randomGif.includes('left.gif')) {
        arrow.className = 'arrow left active';
        arrow.innerHTML = '&#10094;';
    } else {
        arrow.className = 'arrow right active';
        arrow.innerHTML = '&#10095;';
    }

    clickCount++;

    // Проверяем завершение игры
    if (clickCount === maxClicks) {
        setTimeout(() => {
            const modal = document.getElementById('gameEndModal');
            const overlay = document.getElementById('modalOverlay');
            modal.classList.add('active');
            overlay.classList.add('active');

            document.getElementById('modalOkButton').onclick = () => {
                modal.classList.remove('active');
                overlay.classList.remove('active');
                clickCount = 0;
                Array.from(counterContainer.children).forEach(arrow => {
                    arrow.className = 'arrow';
                    arrow.innerHTML = '';
                });
            };
        }, 4050);
    }

    setTimeout(() => {
        centerGif.src = 'chicks.gif';
        centerGif.style.width = '150px';
        centerGif.style.height = 'auto';
    }, 4050);
}); 