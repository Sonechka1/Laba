// Исходные данные: [номер, ценность p_i, вес w_i]
const items = [
    [1,  150,  8],
    [2,  280,  18],
    [3,  180,  45],
    [4,  420,  220],
    [5,  90,   12],
    [6,  110,  15],
    [7,  160,  14],
    [8,  350,  60],
    [9,  480,  380],
    [10, 260,  128]
];

const CAPACITY = 800; // Ограничение рюкзака в кг

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('capacity').textContent = CAPACITY + ' кг';

    const totalWeight = items.reduce((sum, item) => sum + item[2], 0);
    document.getElementById('totalWeight').textContent = totalWeight + ' кг';

    renderSourceTable();
    renderSortedTable();
});

function renderSourceTable() {
    const tbody = document.querySelector('#sourceTable tbody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const [num, value, weight] = item;
        const ratio = value / weight;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${num}</td>
            <td>${value}</td>
            <td>${weight}</td>
            <td>${ratio.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderSortedTable() {
    const tbody = document.querySelector('#sortedTable tbody');
    tbody.innerHTML = '';

    // Сортируем по убыванию p_i / w_i
    const sorted = [...items].sort((a, b) => (b[1] / b[2]) - (a[1] / a[2]));

    sorted.forEach(item => {
        const [num, value, weight] = item;
        const ratio = value / weight;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ratio.toFixed(2)}</td>
            <td>${num}</td>
        `;
        tbody.appendChild(tr);
    });
}

function runAlgorithm() {
    const logDiv = document.getElementById('processLog');
    const resultDiv = document.getElementById('result');
    logDiv.innerHTML = '';
    resultDiv.innerHTML = '';

    // Сортируем предметы по убыванию p_i / w_i
    const sorted = [...items].sort((a, b) => (b[1] / b[2]) - (a[1] / a[2]));

    const selectedItems = [];
    let totalWeight = 0;
    let totalValue = 0;

    // Жадный алгоритм
    sorted.forEach(item => {
        const [num, value, weight] = item;
        const ratio = value / weight;

        const logItem = document.createElement('div');
        logItem.classList.add('log-item');

        if (totalWeight + weight <= CAPACITY) {
            selectedItems.push(num);
            totalWeight += weight;
            totalValue += value;
            logItem.classList.add('added');
            logItem.innerHTML = `Предмет <strong>${num}</strong> (p=${value}, w=${weight}, p/w=${ratio.toFixed(2)}): <strong>добавлен</strong> | Текущий вес: ${totalWeight} кг`;
        } else {
            logItem.classList.add('skipped');
            logItem.innerHTML = `Предмет <strong>${num}</strong> (p=${value}, w=${weight}, p/w=${ratio.toFixed(2)}): <strong>пропущен</strong> (перегрузка: ${totalWeight + weight} > ${CAPACITY})`;
        }

        logDiv.appendChild(logItem);
    });

    // Вывод результата
    resultDiv.innerHTML = `
        <p><strong>Выбранные предметы:</strong> <span>[${selectedItems.join(', ')}]</span></p>
        <p><strong>Общий вес:</strong> <span>${totalWeight} кг</span> из ${CAPACITY} кг</p>
        <p><strong>Общая ценность:</strong> <span>${totalValue}</span></p>
        <p><strong>Оставшаяся вместимость:</strong> <span>${CAPACITY - totalWeight} кг</span></p>
    `;
}