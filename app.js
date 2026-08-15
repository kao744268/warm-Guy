// ===================================
// 溫暖酒場｜智慧備料系統 V3
// app.js
// 採購管理核心
// 備註功能版
// ===================================


// ======================
// LocalStorage
// ======================

const PURCHASE_STORAGE_KEY = "warmSakabaPurchaseV3";
const SAUCE_STORAGE_KEY = "warmSakabaSauceV3";


// ======================
// 資料
// ======================

let purchaseData = {
    wanlaixing: {},
    pxmart: {},
    houyi: {}
};

let sauceState = {};


// ======================
// 初始化
// ======================

document.addEventListener("DOMContentLoaded", function () {

    loadPurchaseData();

    loadSauceData();

    renderPurchasePages();

    renderSaucePage();

    updatePurchaseSummary();

    updatePurchasePreview();

    showPage("wanlaixing");

});


// ======================
// 採購資料讀取
// ======================

function loadPurchaseData() {

    const saved = localStorage.getItem(PURCHASE_STORAGE_KEY);

    if (!saved) {
        return;
    }

    try {

        const parsed = JSON.parse(saved);

        purchaseData = {
            wanlaixing: parsed.wanlaixing || {},
            pxmart: parsed.pxmart || {},
            houyi: parsed.houyi || {}
        };

    } catch (error) {

        console.log("採購資料讀取失敗", error);

        purchaseData = {
            wanlaixing: {},
            pxmart: {},
            houyi: {}
        };

    }

}


// ======================
// 採購資料儲存
// ======================

function savePurchaseData() {

    localStorage.setItem(
        PURCHASE_STORAGE_KEY,
        JSON.stringify(purchaseData)
    );

    updatePurchaseSummary();

    updatePurchasePreview();

}


// ======================
// 醬料資料讀取
// ======================

function loadSauceData() {

    const saved = localStorage.getItem(SAUCE_STORAGE_KEY);

    if (!saved) {
        return;
    }

    try {

        sauceState = JSON.parse(saved);

    } catch (error) {

        console.log("醬料資料讀取失敗", error);

        sauceState = {};

    }

}


// ======================
// 醬料資料儲存
// ======================

function saveSauceData() {

    localStorage.setItem(
        SAUCE_STORAGE_KEY,
        JSON.stringify(sauceState)
    );

}


// ======================
// 取得分類資料
// ======================

function getPurchaseList(category) {

    if (category === "wanlaixing") {
        return wanlaixingData;
    }

    if (category === "pxmart") {
        return pxmartData;
    }

    if (category === "houyi") {
        return houyiData;
    }

    return [];

}


// ======================
// 建立採購頁面
// ======================

function renderPurchasePages() {

    renderPurchasePage(
        "wanlaixing",
        wanlaixingData,
        "🛒 旺來興採購"
    );

    renderPurchasePage(
        "pxmart",
        pxmartData,
        "🛒 全聯採購"
    );

    renderPurchasePage(
        "houyi",
        houyiData,
        "🛒 後驛店採購"
    );

}


// ======================
// 建立單一採購頁面
// ======================

function renderPurchasePage(category, list, titleText) {

    const section = document.getElementById(category);

    if (!section) {
        return;
    }

    section.innerHTML = "";

    const title = document.createElement("h2");

    title.textContent = titleText;

    section.appendChild(title);


    const description = document.createElement("div");

    description.className = "section-description";

    description.textContent =
        "選擇今天需要採購的品項與數量";

    section.appendChild(description);


    list.forEach(function (item, index) {

        const card = createPurchaseCard(
            category,
            item,
            index
        );

        section.appendChild(card);

    });

}


// ======================
// 建立品項卡片
// ======================

function createPurchaseCard(category, item, index) {

    const card = document.createElement("div");

    card.className = "card";


    const state = getItemState(
        category,
        index
    );


    // ==================
    // 品項名稱
    // ==================

    const title = document.createElement("h3");

    title.textContent = item.name;

    card.appendChild(title);


    // ==================
    // 規格
    // ==================

    if (item.options) {

        const optionTitle = document.createElement("div");

        optionTitle.className = "option-title";

        optionTitle.textContent = "規格";

        card.appendChild(optionTitle);


        const optionBox = document.createElement("div");

        optionBox.className = "option-box";


        item.options.forEach(function (option) {

            const button = document.createElement("button");

            button.type = "button";

            button.className = "option-button";

            button.textContent = option;


            if (state.option === option) {

                button.classList.add("active");

            }


            button.addEventListener(
                "click",
                function () {

                    selectOption(
                        category,
                        index,
                        option
                    );

                }
            );


            optionBox.appendChild(button);

        });


        card.appendChild(optionBox);

    }


    // ==================
    // 數量
    // ==================

    const row = document.createElement("div");

    row.className = "row";


    const minus = document.createElement("button");

    minus.type = "button";

    minus.textContent = "−";


    minus.addEventListener(
        "click",
        function () {

            changeQuantity(
                category,
                index,
                -1
            );

        }
    );


    const quantity = document.createElement("span");

    quantity.textContent = state.quantity;


    const plus = document.createElement("button");

    plus.type = "button";

    plus.textContent = "+";


    plus.addEventListener(
        "click",
        function () {

            changeQuantity(
                category,
                index,
                1
            );

        }
    );


    row.appendChild(minus);

    row.appendChild(quantity);

    row.appendChild(plus);

    card.appendChild(row);


    // ==================
    // 備註
    // ==================

    const noteTitle = document.createElement("div");

    noteTitle.className = "note-title";

    noteTitle.textContent = "備註";

    card.appendChild(noteTitle);


    const noteInput = document.createElement("input");

    noteInput.type = "text";

    noteInput.className = "purchase-note";

    noteInput.placeholder =
        "例如：指定品牌、規格、數量備註";

    noteInput.value =
        state.note || "";


    noteInput.addEventListener(
        "input",
        function () {

            const currentState =
                getItemState(
                    category,
                    index
                );

            currentState.note =
                noteInput.value;

            savePurchaseData();

        }
    );


    card.appendChild(noteInput);


    // ==================
    // 採購按鈕
    // ==================

    const purchaseButton = document.createElement("button");

    purchaseButton.type = "button";

    purchaseButton.className = "purchase-button";


    if (state.selected) {

        purchaseButton.classList.add("active");

        purchaseButton.textContent =
            "✓ 已加入採購";

    } else {

        purchaseButton.textContent =
            "加入採購";

    }


    purchaseButton.addEventListener(
        "click",
        function () {

            togglePurchase(
                category,
                index
            );

        }
    );


    card.appendChild(purchaseButton);


    return card;

}


// ======================
// 取得品項狀態
// ======================

function getItemState(category, index) {

    if (!purchaseData[category]) {

        purchaseData[category] = {};

    }


    if (!purchaseData[category][index]) {

        purchaseData[category][index] = {

            quantity: 0,

            selected: false,

            option: "",

            note: ""

        };

    }


    // 相容舊版資料
    if (
        typeof purchaseData[category][index].note !==
        "string"
    ) {

        purchaseData[category][index].note = "";

    }


    return purchaseData[category][index];

}


// ======================
// 修改數量
// ======================

function changeQuantity(category, index, amount) {

    const state = getItemState(
        category,
        index
    );


    state.quantity += amount;


    if (state.quantity < 0) {

        state.quantity = 0;

    }


    if (state.quantity > 999) {

        state.quantity = 999;

    }


    if (state.quantity > 0) {

        state.selected = true;

    }


    if (state.quantity === 0) {

        state.selected = false;

    }


    savePurchaseData();

    renderPurchasePages();

}


// ======================
// 選擇規格
// ======================

function selectOption(category, index, option) {

    const state = getItemState(
        category,
        index
    );


    state.option = option;

    state.selected = true;


    if (state.quantity === 0) {

        state.quantity = 1;

    }


    savePurchaseData();

    renderPurchasePages();

}


// ======================
// 加入／取消採購
// ======================

function togglePurchase(category, index) {

    const state = getItemState(
        category,
        index
    );


    const list = getPurchaseList(
        category
    );


    if (state.selected) {

        state.selected = false;

    } else {

        state.selected = true;


        if (state.quantity === 0) {

            state.quantity = 1;

        }


        if (
            list[index].options &&
            !state.option
        ) {

            state.option =
                list[index].options[0];

        }

    }


    savePurchaseData();

    renderPurchasePages();

}


// ======================
// 今日採購總覽
// ======================

function updatePurchaseSummary() {

    updateSummaryCount(
        "wanlaixing",
        wanlaixingData,
        "summary-wanlaixing"
    );


    updateSummaryCount(
        "pxmart",
        pxmartData,
        "summary-pxmart"
    );


    updateSummaryCount(
        "houyi",
        houyiData,
        "summary-houyi"
    );

}


// ======================
// 更新單一數量
// ======================

function updateSummaryCount(
    category,
    list,
    elementId
) {

    const element =
        document.getElementById(elementId);


    if (!element) {
        return;
    }


    let count = 0;


    list.forEach(function (item, index) {

        const state =
            getItemState(
                category,
                index
            );


        if (
            state.selected &&
            state.quantity > 0
        ) {

            count++;

        }

    });


    element.textContent = count;

}


// ======================
// 頁面切換
// ======================

function showPage(page) {

    const sections =
        document.querySelectorAll(
            "main section"
        );


    sections.forEach(function (section) {

        section.classList.remove("active");

    });


    const target =
        document.getElementById(page);


    if (!target) {
        return;
    }


    target.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================
// 醬料製作
// ======================

function renderSaucePage() {

    const section =
        document.getElementById("sauce");


    if (!section) {
        return;
    }


    section.innerHTML = "";


    const title =
        document.createElement("h2");

    title.textContent =
        "🥣 醬料製作";

    section.appendChild(title);


    const description =
        document.createElement("div");

    description.className =
        "section-description";

    description.textContent =
        "選擇今天需要製作的醬料";

    section.appendChild(description);


    sauceData.forEach(function (sauce, index) {

        const card =
            document.createElement("div");

        card.className = "card sauce-card";


        const title =
            document.createElement("h3");

        title.textContent =
            sauce.name;

        card.appendChild(title);


        sauce.materials.forEach(
            function (material) {

                const materialRow =
                    document.createElement("div");

                materialRow.className =
                    "sauce-material";

                materialRow.textContent =
                    "・" + material;

                card.appendChild(
                    materialRow
                );

            }
        );


        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "purchase-button";


        if (sauceState[index]) {

            button.classList.add("active");

            button.textContent =
                "✓ 已加入備料";

        } else {

            button.textContent =
                "加入備料";

        }


        button.addEventListener(
            "click",
            function () {

                sauceState[index] =
                    !sauceState[index];

                saveSauceData();

                renderSaucePage();

            }
        );


        card.appendChild(button);


        section.appendChild(card);

    });

}


// ======================
// 產生採購單
// ======================

function createLINE() {

    let text =
        "【溫暖酒場｜今日採購】\n\n";


    let hasPurchase = false;


    const wanText =
        createCategoryLINE(
            "wanlaixing",
            wanlaixingData
        );


    if (wanText) {

        text +=
            "🟥 旺來興\n" +
            wanText +
            "\n\n";

        hasPurchase = true;

    }


    const pxText =
        createCategoryLINE(
            "pxmart",
            pxmartData
        );


    if (pxText) {

        text +=
            "🟩 全聯\n" +
            pxText +
            "\n\n";

        hasPurchase = true;

    }


    const houyiText =
        createCategoryLINE(
            "houyi",
            houyiData
        );


    if (houyiText) {

        text +=
            "🟫 後驛店\n" +
            houyiText +
            "\n\n";

        hasPurchase = true;

    }


    const sauceText =
        createSauceLINE();


    if (sauceText) {

        text +=
            "🥣 醬料製作\n" +
            sauceText +
            "\n\n";

        hasPurchase = true;

    }


    if (!hasPurchase) {

        text +=
            "目前沒有選擇任何採購品項。";

    }


    const textarea =
        document.getElementById("lineText");


    if (textarea) {

        textarea.value =
            text.trim();

    }


    updatePurchasePreview();

}


// ======================
// 分類採購文字
// ======================

function createCategoryLINE(
    category,
    list
) {

    const lines = [];


    list.forEach(function (item, index) {

        const state =
            getItemState(
                category,
                index
            );


        if (
            state.selected &&
            state.quantity > 0
        ) {

            let line =
                "・" + item.name;


            // 規格
            if (item.options) {

                line +=
                    " " +
                    (
                        state.option ||
                        item.options[0]
                    );

            }


            // 數量
            line +=
                " × " +
                state.quantity;


            // 備註
            if (
                state.note &&
                state.note.trim()
            ) {

                line +=
                    "\n  📝 " +
                    state.note.trim();

            }


            lines.push(line);

        }

    });


    return lines.join("\n");

}


// ======================
// 醬料採購文字
// ======================

function createSauceLINE() {

    const lines = [];


    sauceData.forEach(function (sauce, index) {

        if (sauceState[index]) {

            lines.push(
                "・" + sauce.name
            );

        }

    });


    return lines.join("\n");

}


// ======================
// 採購單預覽
// ======================

function updatePurchasePreview() {

    const preview =
        document.getElementById(
            "purchase-preview"
        );


    if (!preview) {
        return;
    }


    const counts = {

        wanlaixing: 0,

        pxmart: 0,

        houyi: 0

    };


    [
        "wanlaixing",
        "pxmart",
        "houyi"
    ].forEach(function (category) {

        const list =
            getPurchaseList(category);


        list.forEach(function (item, index) {

            const state =
                getItemState(
                    category,
                    index
                );


            if (
                state.selected &&
                state.quantity > 0
            ) {

                counts[category]++;

            }

        });

    });


    const total =
        counts.wanlaixing +
        counts.pxmart +
        counts.houyi;


    if (total === 0) {

        preview.innerHTML =
            "目前尚未選擇採購品項。";

        return;

    }


    preview.innerHTML =

        "🟥 旺來興　" +
        counts.wanlaixing +
        " 項<br>" +

        "🟩 全聯　　" +
        counts.pxmart +
        " 項<br>" +

        "🟫 後驛店　" +
        counts.houyi +
        " 項";

}


// ======================
// 複製採購單
// ======================

function copyLINE() {

    const textarea =
        document.getElementById("lineText");


    if (
        !textarea ||
        !textarea.value.trim()
    ) {

        alert(
            "請先產生採購單。"
        );

        return;

    }


    navigator.clipboard.writeText(
        textarea.value
    )
    .then(function () {

        alert(
            "已複製採購單。"
        );

    })
    .catch(function () {

        textarea.select();

        alert(
            "請手動複製採購單。"
        );

    });

}


// ======================
// 一鍵歸零
// ======================

function resetAll() {

    const confirmed =
        confirm(
            "確定要清除今天所有採購與醬料備料紀錄嗎？"
        );


    if (!confirmed) {
        return;
    }


    purchaseData = {

        wanlaixing: {},

        pxmart: {},

        houyi: {}

    };


    sauceState = {};


    localStorage.removeItem(
        PURCHASE_STORAGE_KEY
    );


    localStorage.removeItem(
        SAUCE_STORAGE_KEY
    );


    renderPurchasePages();

    renderSaucePage();

    updatePurchaseSummary();

    updatePurchasePreview();


    const textarea =
        document.getElementById("lineText");


    if (textarea) {

        textarea.value = "";

    }

}
