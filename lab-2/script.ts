const categories = new Map([
    [
        'race',
        {
            title: 'Гонка',
            news: [
                {
                    title: 'Финишный протокол пересчитан после штрафа лидера',
                    text: 'Дирекция этапа добавила пять секунд за нарушение границ трассы, поэтому победа перешла к пилоту MosPoly Racing.',
                    time: '12:40',
                    top: true,
                    critical: true
                },
                {
                    title: 'Пит-стоп на 18 круге помог сохранить подиум',
                    text: 'Команда раньше соперников перешла на свежий комплект и получила преимущество в финальной части заезда.',
                    time: '12:18',
                    top: true,
                    critical: false
                },
                {
                    title: 'Сейфти-кар собрал пелотон перед последними кругами',
                    text: 'После остановки машины на выходе из третьего сектора маршалы временно снизили скорость гонки.',
                    time: '11:55',
                    top: false,
                    critical: false
                }
            ]
        }
    ],
    [
        'team',
        {
            title: 'Команда',
            news: [
                {
                    title: 'Гоночный инженер изменил план подготовки второго пилота',
                    text: 'Утренний брифинг показал проблему с темпом на длинной серии, поэтому тренировка будет посвящена стабильности.',
                    time: '10:30',
                    top: true,
                    critical: false
                },
                {
                    title: 'Команда закрыла смену без перерасхода бюджета',
                    text: 'После этапа остался резерв на обновление тормозной системы и дополнительный симуляторный день.',
                    time: '09:45',
                    top: false,
                    critical: false
                },
                {
                    title: 'Пилоты получили разные задачи на практику',
                    text: 'Первый экипаж проверит гоночный темп, второй соберет данные по работе мягкого состава.',
                    time: '09:10',
                    top: false,
                    critical: false
                }
            ]
        }
    ],
    [
        'tech',
        {
            title: 'Техника',
            news: [
                {
                    title: 'Новый аэродинамический пакет дал плюс 0,3 секунды',
                    text: 'Переднее крыло и измененный диффузор улучшили баланс машины в скоростных поворотах.',
                    time: '14:05',
                    top: true,
                    critical: false
                },
                {
                    title: 'Телеметрия показала перегрев тормозов',
                    text: 'Инженеры ограничили агрессивные настройки, чтобы сохранить надежность на дистанции гонки.',
                    time: '13:25',
                    top: true,
                    critical: true
                },
                {
                    title: 'Механики заменили коробку передач до квалификации',
                    text: 'Команда успела провести проверку без штрафа, потому что ресурс старого узла закончился после практики.',
                    time: '12:50',
                    top: false,
                    critical: false
                }
            ]
        }
    ],
    [
        'season',
        {
            title: 'Сезон',
            news: [
                {
                    title: 'MosPoly Racing поднялась на второе место в зачете',
                    text: 'Двойной финиш в очках сократил отставание от лидера чемпионата до семи баллов.',
                    time: '18:20',
                    top: true,
                    critical: false
                },
                {
                    title: 'Следующий этап пройдет на городской трассе',
                    text: 'Команды готовят высокий прижим и осторожную стратегию, потому что обгонять на этой конфигурации сложно.',
                    time: '17:10',
                    top: false,
                    critical: false
                },
                {
                    title: 'Регламент обновлений закрывается через два этапа',
                    text: 'После дедлайна разрешены только надежностные изменения, поэтому ближайшие решения станут решающими.',
                    time: '16:35',
                    top: true,
                    critical: true
                }
            ]
        }
    ]
]);

function selectElement(selector = '') {
    const element = document.querySelector(selector);

    if (!element) {
        throw new Error(`Не найден элемент ${selector}`);
    }

    return element;
}

const buttons = document.querySelectorAll('.category-button');
const categoryTitle = selectElement('#category-title');
const mainStoryTitle = selectElement('#main-story-title');
const mainStoryText = selectElement('#main-story-text');
const mainStoryTime = selectElement('#main-story-time');
const mainStoryPriority = selectElement('#main-story-priority');
const newsCount = selectElement('#news-count');
const topCount = selectElement('#top-count');
const newsList = selectElement('#news-list');

function createNewsCard(newsItem = {
    title: '',
    text: '',
    time: '',
    top: false,
    critical: false
}) {
    const card = document.createElement('article');
    card.className = 'news-card';

    if (newsItem.top) {
        card.classList.add('top');
    }

    if (newsItem.critical) {
        card.classList.add('critical');
    }

    const title = document.createElement('h3');
    title.textContent = newsItem.title;

    const text = document.createElement('p');
    text.textContent = newsItem.text;

    const footer = document.createElement('div');
    footer.className = 'news-card-footer';

    const time = document.createElement('span');
    time.textContent = newsItem.time;
    footer.append(time);

    if (newsItem.top) {
        const topLabel = document.createElement('span');
        topLabel.className = 'top-label';
        topLabel.textContent = 'Топ';
        footer.append(topLabel);
    }

    if (newsItem.critical) {
        const criticalLabel = document.createElement('span');
        criticalLabel.className = 'critical-label';
        criticalLabel.textContent = 'Срочно';
        footer.append(criticalLabel);
    }

    card.append(title, text, footer);
    return card;
}

function renderCategory(categoryName = 'race') {
    const category = categories.get(categoryName) || categories.get('race');

    if (!category) {
        return;
    }

    const mainStory = category.news[0];
    const topNews = category.news.filter((newsItem) => newsItem.top);

    categoryTitle.textContent = category.title;
    mainStoryTitle.textContent = mainStory.title;
    mainStoryText.textContent = mainStory.text;
    mainStoryTime.textContent = mainStory.time;
    mainStoryPriority.textContent = mainStory.critical ? 'Срочный материал' : 'Важный материал';
    newsCount.textContent = String(category.news.length);
    topCount.textContent = String(topNews.length);

    newsList.replaceChildren(...category.news.map(createNewsCard));

    buttons.forEach((button) => {
        button.classList.toggle('active', button.getAttribute('data-category') === categoryName);
    });
}

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        renderCategory(button.getAttribute('data-category') || 'race');
    });
});

renderCategory('race');
