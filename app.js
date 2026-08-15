// ===================================
// 溫暖酒場｜智慧備料系統 V3
// app.js
// 採購管理版
// ===================================


// ======================
// 本機資料
// ======================

const PURCHASE_STORAGE_KEY =
    "warmSakabaPurchaseV3";

const SAUCE_STORAGE_KEY =
    "warmSakabaSauceV3";




// ======================
// 採購資料
// ======================

let purchaseData = {

    wanlaixing: {},

    pxmart: {},

    houyi: {}

};




// ======================
// 醬料資料
// ======================

let sauceState = {};




// ======================
// 初始化
// ======================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadPurchaseData();

        loadSauceData();

        renderPurchasePages();

        renderSaucePage();

        showPage("wanlaixing");

    }
);




// ======================
// 讀取採購資料
// ======================

function loadPurchaseData(){

    const saved =
        localStorage.getItem(
            PURCHASE_STORAGE_KEY
        );

    if(saved){

        try{

            const parsed =
                JSON.parse(saved);

            purchaseData = {

                wanlaixing:
                    parsed.wanlaixing || {},

                pxmart:
                    parsed.pxmart || {},

                houyi:
                    parsed.houyi || {}

            };

        }
        catch(error){

            console.log(
                "採購資料讀取失敗",
                error
            );

        }

    }

}




// ======================
// 儲存採購資料
// ======================

function savePurchaseData(){

    localStorage.setItem(

        PURCHASE_STORAGE_KEY,

        JSON.stringify(
            purchaseData
        )

    );

}




// ======================
// 讀取醬料資料
// ======================

function loadSauceData(){

    const saved =
        localStorage.getItem(
            SAUCE_STORAGE_KEY
        );

    if(saved){

        try{

            sauceState =
                JSON.parse(saved);

        }
        catch(error){

            console.log(
                "醬料資料讀取失敗",
                error
            );

        }

    }

}




// ======================
// 儲存醬料資料
// ======================

function saveSauceData(){

    localStorage.setItem(

        SAUCE_STORAGE_KEY,

        JSON.stringify(
            sauceState
        )

    );

}




// ======================
// 取得採購資料
// ======================

function getPurchaseList(
    category
){

    if(
        category === "wanlaixing"
    ){

        return wanlaixingData;

    }


    if(
        category === "pxmart"
    ){

        return pxmartData;

    }


    if(
        category === "houyi"
    ){

        return houyiData;

    }


    return [];

}




// ======================
// 建立採購頁面
// ======================

function renderPurchasePages(){

    renderPurchasePage(
        "wanlaixing",
        wanlaixingData
    );

    renderPurchasePage(
        "pxmart",
        pxmartData
    );

    renderPurchasePage(
        "houyi",
        houyiData
    );

}




// ======================
// 建立單一採購頁面
// ======================

function renderPurchasePage(
    category,
    list
){

    const section =
        document.getElementById(
            category
        );

    if(!section){

        return;

    }


    section.innerHTML = "";


    const title =
        document.createElement("h2");


    if(category === "wanlaixing"){

        title.textContent =
            "🛒 旺來興採購";

    }


    if(category === "pxmart"){

        title.textContent =
            "🛒 全聯採購";

    }


    if(category === "houyi"){

        title.textContent =
            "🛒 後驛店採購";

    }


    section.appendChild(
        title
    );


    list.forEach(
        function(item, index){

            const card =
                createPurchaseCard(
                    category,
                    item,
                    index
                );

            section.appendChild(
                card
            );

        }
    );

}




// ======================
// 建立採購品項卡
// ======================

function createPurchaseCard(
    category,
    item,
    index
){

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "card";


    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        item.name;


    card.appendChild(
        title
    );



    // ==================
    // 規格選擇
    // ==================

    if(item.options){

        const optionBox =
            document.createElement(
                "div"
            );

        optionBox.className =
            "option-box";


        item.options.forEach(
            function(option){

                const button =
                    document.createElement(
                        "button"
                    );

                button.textContent =
                    option;


                button.className =
                    "option-button";


                const current =
                    getItemState(
                        category,
                        index
                    );


                if(
                    current.option === option
                ){

                    button.classList.add(
                        "active"
                    );

                }


                button.onclick =
                    function(){

                        selectOption(

                            category,

                            index,

                            option

                        );

                    };


                optionBox.appendChild(
                    button
                );

            }
        );


        card.appendChild(
            optionBox
        );

    }



    // ==================
    // 數量控制
    // ==================

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "row";


    const minus =
        document.createElement(
            "button"
        );

    minus.textContent =
        "−";


    minus.onclick =
        function(){

            changeQuantity(

                category,

                index,

                -1

            );

        };


    const quantity =
        document.createElement(
            "span"
        );


    quantity.textContent =
        getItemQuantity(
            category,
            index
        );


    quantity.id =
        "quantity-" +
        category +
        "-" +
        index;


    const plus =
        document.createElement(
            "button"
        );


    plus.textContent =
        "+";


    plus.onclick =
        function(){

            changeQuantity(

                category,

                index,

                1

            );

        };


    row.appendChild(
        minus
    );

    row.appendChild(
        quantity
    );

    row.appendChild(
        plus
    );


    card.appendChild(
        row
    );



    // ==================
    // 採購按鈕
    // ==================

    const purchaseButton =
        document.createElement(
            "button"
        );


    purchaseButton.textContent =
        "加入採購";


    purchaseButton.onclick =
        function(){

            togglePurchase(

                category,

                index

            );

        };


    const current =
        getItemState(
            category,
            index
        );


    if(current.selected){

        purchaseButton.classList.add(
            "active"
        );

        purchaseButton.textContent =
            "✓ 已加入採購";

    }


    card.appendChild(
        purchaseButton
    );


    return card;

}




// ======================
// 取得品項狀態
// ======================

function getItemState(
    category,
    index
){

    if(
        !purchaseData[category]
    ){

        purchaseData[category] =
            {};

    }


    if(
        !purchaseData[category][index]
    ){

        purchaseData[category][index] = {

            quantity: 0,

            selected: false,

            option: ""

        };

    }


    return purchaseData[category][index];

}




// ======================
// 取得數量
// ======================

function getItemQuantity(
    category,
    index
){

    return getItemState(
        category,
        index
    ).quantity;

}




// ======================
// 修改數量
// ======================

function changeQuantity(

    category,

    index,

    amount

){

    const item =
        getItemState(
            category,
            index
        );


    item.quantity +=
        amount;


    if(
        item.quantity < 0
    ){

        item.quantity = 0;

    }


    if(
        item.quantity > 999
    ){

        item.quantity = 999;

    }


    if(
        item.quantity > 0
    ){

        item.selected = true;

    }


    savePurchaseData();


    updateQuantityDisplay(

        category,

        index

    );


    refreshCardButton(

        category,

        index

    );

}




// ======================
// 更新數量顯示
// ======================

function updateQuantityDisplay(

    category,

    index

){

    const element =
        document.getElementById(

            "quantity-" +
            category +
            "-" +
            index

        );


    if(element){

        element.textContent =
            getItemQuantity(
                category,
                index
            );

    }

}




// ======================
// 選擇規格
// ======================

function selectOption(

    category,

    index,

    option

){

    const item =
        getItemState(
            category,
            index
        );


    item.option =
        option;


    item.selected =
        true;


    if(
        item.quantity === 0
    ){

        item.quantity = 1;

    }


    savePurchaseData();


    renderPurchasePages();

}




// ======================
// 加入／取消採購
// ======================

function togglePurchase(

    category,

    index

){

    const item =
        getItemState(
            category,
            index
        );


    if(
        item.selected
    ){

        item.selected = false;

    }
    else{

        item.selected = true;


        if(
            item.quantity === 0
        ){

            item.quantity = 1;

        }


        const data =
            getPurchaseList(
                category
            );


        if(
            data[index].options &&
            !item.option
        ){

            item.option =
                data[index].options[0];

        }

    }


    savePurchaseData();


    renderPurchasePages();

}




// ======================
// 更新採購按鈕
// ======================

function refreshCardButton(

    category,

    index

){

    renderPurchasePages();

}




// ======================
// 顯示頁面
// ======================

function showPage(
    page
){

    const sections =
        document.querySelectorAll(
            "main section"
        );


    sections.forEach(
        function(section){

            section.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            page
        );


    if(target){

        target.classList.add(
            "active"
        );

    }


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}




// ======================
// 醬料頁面
// ======================

function renderSaucePage(){

    const section =
        document.getElementById(
            "sauce"
        );


    if(!section){

        return;

    }


    section.innerHTML = "";


    const title =
        document.createElement(
            "h2"
        );


    title.textContent =
        "🥣 醬料製作";


    section.appendChild(
        title
    );


    sauceData.forEach(
        function(sauce, index){

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            const name =
                document.createElement(
                    "h3"
                );


            name.textContent =
                sauce.name;


            card.appendChild(
                name
            );


            sauce.materials.forEach(
                function(material){

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "sauce-material";


                    row.textContent =
                        "・" + material;


                    card.appendChild(
                        row
                    );

                }
            );


            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                "加入備料";


            if(
                sauceState[index]
            ){

                button.classList.add(
                    "active"
                );

                button.textContent =
                    "✓ 已加入備料";

            }


            button.onclick =
                function(){

                    sauceState[index] =
                        !sauceState[index];


                    saveSauceData();

                    renderSaucePage();

                };


            card.appendChild(
                button
            );


            section.appendChild(
                card
            );

        }
    );

}




// ======================
// 建立 LINE 採購通知
// ======================

function createLINE(){

    let text =
        "【溫暖酒場｜採購清單】\n\n";


    let hasPurchase =
        false;



    // ==================
    // 旺來興
    // ==================

    const wanText =
        createCategoryLINE(

            "旺來興",

            "wanlaixing",

            wanlaixingData

        );


    if(wanText){

        text +=
            "🟥 旺來興\n" +
            wanText +
            "\n";

        hasPurchase =
            true;

    }



    // ==================
    // 全聯
    // ==================

    const pxText =
        createCategoryLINE(

            "全聯",

            "pxmart",

            pxmartData

        );


    if(pxText){

        text +=
            "🟩 全聯\n" +
            pxText +
            "\n";

        hasPurchase =
            true;

    }



    // ==================
    // 後驛店
    // ==================

    const houyiText =
        createCategoryLINE(

            "後驛店",

            "houyi",

            houyiData

        );


    if(houyiText){

        text +=
            "🟫 後驛店\n" +
            houyiText +
            "\n";

        hasPurchase =
            true;

    }



    // ==================
    // 醬料
    // ==================

    const sauceText =
        createSauceLINE();


    if(sauceText){

        text +=
            "🥣 醬料製作\n" +
            sauceText +
            "\n";

        hasPurchase =
            true;

    }



    if(!hasPurchase){

        text +=
            "目前沒有需要採購的品項。";

    }



    const textarea =
        document.getElementById(
            "lineText"
        );


    if(textarea){

        textarea.value =
            text.trim();

    }

}




// ======================
// 建立分類 LINE
// ======================

function createCategoryLINE(

    categoryName,

    category,

    list

){

    const lines = [];


    list.forEach(

        function(item, index){

            const state =
                getItemState(
                    category,
                    index
                );


            if(
                state.selected &&
                state.quantity > 0
            ){

                let line =
                    item.name;


                if(
                    item.options
                ){

                    line +=
                        " " +
                        (
                            state.option ||
                            item.options[0]
                        );

                }


                line +=
                    " × " +
                    state.quantity;


                lines.push(
                    line
                );

            }

        }

    );


    return lines.join("\n");

}




// ======================
// 建立醬料 LINE
// ======================

function createSauceLINE(){

    const lines = [];


    sauceData.forEach(

        function(sauce, index){

            if(
                sauceState[index]
            ){

                lines.push(
                    "・" +
                    sauce.name
                );

            }

        }

    );


    return lines.join("\n");

}




// ======================
// 複製 LINE 文字
// ======================

function copyLINE(){

    const textarea =
        document.getElementById(
            "lineText"
        );


    if(!textarea){

        return;

    }


    if(
        !textarea.value.trim()
    ){

        alert(
            "請先產生採購通知。"
        );

        return;

    }


    textarea.select();


    textarea.setSelectionRange(

        0,

        textarea.value.length

    );


    navigator.clipboard.writeText(

        textarea.value

    )
    .then(

        function(){

            alert(
                "已複製採購通知。"
            );

        }

    )
    .catch(

        function(){

            alert(
                "複製失敗，請手動複製。"
            );

        }

    );

}




// ======================
// 一鍵歸零
// ======================

function resetAll(){

    const confirmed =
        confirm(

            "確定要清除所有採購數量與備料紀錄嗎？"

        );


    if(!confirmed){

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

    createLINE();

}
