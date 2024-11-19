import express from "express";

// Функція для генерації випадкової послідовності
function generateRandomSequence(length: number, values: number[]): number[] {
    return Array.from({ length }, () => values[Math.floor(Math.random() * values.length)]);
}

// Функція для отримання варіаційного ряду
function getVariationSeries(data: number[]): number[] {
    return [...data].sort((a, b) => a - b);
}

// Функція для отримання статистичного розподілу
function getStatisticalDistribution(data: number[]): Map<number, number> {
    const distribution = new Map<number, number>();
    for (const value of data) {
        distribution.set(value, (distribution.get(value) || 0) + 1);
    }
    return distribution;
}

// Функція для отримання інтегральної частоти
function getCumulativeFrequency(distribution: Map<number, number>): Map<number, number> {
    let cumulative = 0;
    const cumulativeFrequency = new Map<number, number>();
    for (const [value, frequency] of [...distribution.entries()].sort((a, b) => a[0] - b[0])) {
        cumulative += frequency;
        cumulativeFrequency.set(value, cumulative);
    }
    return cumulativeFrequency;
}

// Функція для отримання частості
function getRelativeFrequency(distribution: Map<number, number>, total: number): Map<number, number> {
    const relativeFrequency = new Map<number, number>();
    for (const [value, frequency] of distribution.entries()) {
        relativeFrequency.set(value, frequency / total);
    }
    return relativeFrequency;
}

// Налаштування сервера
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    const length = 14;
    const values = [1, 2, 3, 4, 5];
    const data = generateRandomSequence(length, values);
    const variationSeries = getVariationSeries(data);
    const distribution = getStatisticalDistribution(data);
    const cumulativeFrequency = getCumulativeFrequency(distribution);
    const relativeFrequency = getRelativeFrequency(distribution, data.length);

    // Формуємо HTML-сторінку
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Аналіз Даних</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #f4f4f4; }
        .container { max-width: 800px; margin: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Аналіз випадкових даних</h1>
        <h2>Вихідні дані</h2>
        <p>${data.join(", ")}</p>

        <h2>Варіаційний ряд</h2>
        <p>${variationSeries.join(", ")}</p>

        <h2>Статистичний розподіл</h2>
        <table>
            <thead>
                <tr>
                    <th>Значення</th>
                    <th>Частота</th>
                </tr>
            </thead>
            <tbody>
                ${Array.from(distribution.entries())
                    .map(([value, frequency]) => `<tr><td>${value}</td><td>${frequency}</td></tr>`)
                    .join("")}
            </tbody>
        </table>

        <h2>Інтегральна частота</h2>
        <table>
            <thead>
                <tr>
                    <th>Значення</th>
                    <th>Інтегральна частота</th>
                </tr>
            </thead>
            <tbody>
                ${Array.from(cumulativeFrequency.entries())
                    .map(([value, frequency]) => `<tr><td>${value}</td><td>${frequency}</td></tr>`)
                    .join("")}
            </tbody>
        </table>

        <h2>Частість</h2>
        <table>
            <thead>
                <tr>
                    <th>Значення</th>
                    <th>Частість</th>
                </tr>
            </thead>
            <tbody>
                ${Array.from(relativeFrequency.entries())
                    .map(([value, frequency]) => `<tr><td>${value}</td><td>${frequency.toFixed(2)}</td></tr>`)
                    .join("")}
            </tbody>
        </table>
    </div>
</body>
</html>
    `;
    res.send(html);
});

app.listen(port, () => {
    console.log(`Сервер запущено: http://localhost:${port}`);
});
