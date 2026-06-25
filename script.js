const feedInput = document.getElementById("rssInput");
const addFeedBtn = document.getElementById("addFeed");
const feedList = document.getElementById("feedList");
const newsList = document.getElementById("newsList");
const feedTitle = document.getElementById("feedTitle");

let feeds = JSON.parse(
localStorage.getItem("rssFeeds")
) || [];

renderFeeds();

addFeedBtn.onclick = () => {

    const url = feedInput.value.trim();

    if(!url) return;

    feeds.push(url);

    localStorage.setItem(
        "rssFeeds",
        JSON.stringify(feeds)
    );

    renderFeeds();

    feedInput.value = "";
};

function renderFeeds(){

    feedList.innerHTML = "";

    feeds.forEach(feed => {

        const div = document.createElement("div");

        div.className = "feed-item";

        div.textContent = feed;

        div.onclick = () => {
            loadFeed(feed);
        };

        feedList.appendChild(div);

    });

}

async function loadFeed(url){

    feedTitle.textContent = "Carregando...";

    newsList.innerHTML = "";

    try{

        const response = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=" +
            encodeURIComponent(url)
        );

        const data = await response.json();

        feedTitle.textContent = data.feed.title;

        data.items.forEach(item => {

            const card =
            document.createElement("div");

            card.className = "news-card";

            card.innerHTML = `
                <a href="${item.link}"
                target="_blank">
                ${item.title}
                </a>

                <p>
                ${item.description.slice(0,150)}...
                </p>
            `;

            newsList.appendChild(card);

        });

    }catch{

        feedTitle.textContent =
        "Erro ao carregar feed";

    }

}