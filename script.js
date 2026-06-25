const feedInput = document.getElementById("rssInput");
const addFeedBtn = document.getElementById("addFeed");
const feedList = document.getElementById("feedList");
const newsList = document.getElementById("newsList");
const feedTitle = document.getElementById("feedTitle");

let feeds = JSON.parse(localStorage.getItem("rssFeeds")) || [];

renderFeeds();

/* =========================
   ADICIONAR FEED
========================= */

addFeedBtn.onclick = () => {

    const url = feedInput.value.trim();

    if (!url) return;

    feeds.push(url);

    saveFeeds();

    renderFeeds();

    feedInput.value = "";
};

/* =========================
   SALVAR LOCALSTORAGE
========================= */

function saveFeeds() {
    localStorage.setItem("rssFeeds", JSON.stringify(feeds));
}

/* =========================
   RENDER FEEDS
========================= */

function renderFeeds() {

    feedList.innerHTML = "";

    feeds.forEach((feed, index) => {

        const div = document.createElement("div");
        div.className = "feed-item";

        const text = document.createElement("div");
        text.className = "feed-text";
        text.textContent = feed;

        text.onclick = () => loadFeed(feed);

        const del = document.createElement("button");
        del.className = "feed-delete";

        del.onclick = (e) => {
            e.stopPropagation();
            removeFeed(index);
        };

        div.appendChild(text);
        div.appendChild(del);

        feedList.appendChild(div);
    });
}

/* =========================
   REMOVER FEED
========================= */

function removeFeed(index) {

    feeds.splice(index, 1);

    saveFeeds();

    renderFeeds();

    feedTitle.textContent = "Selecione um feed";
    newsList.innerHTML = "";
}

/* =========================
   CARREGAR RSS
========================= */

async function loadFeed(url) {

    feedTitle.textContent = "Carregando...";
    newsList.innerHTML = "";

    try {

        const response = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=" +
            encodeURIComponent(url)
        );

        const data = await response.json();

        feedTitle.textContent = data.feed.title;

        data.items.forEach(item => {

            const card = document.createElement("div");
            card.className = "news-card";

            card.innerHTML = `
                <a href="${item.link}" target="_blank">
                    ${item.title}
                </a>

                <p>
                    ${item.description.slice(0,150)}...
                </p>
            `;

            newsList.appendChild(card);

        });

    } catch {

        feedTitle.textContent = "Erro ao carregar feed";
    }
}
