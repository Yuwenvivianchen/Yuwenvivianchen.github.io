let shopData = [];// 用來儲存商店資料的全域變數

// 取得並初始化商店資料，fetchShopData 函數用於通過HTTP請求從伺服器取得商店數據，然後初始化 Swiper 輪播元件。
function fetchShopData() {
    fetch("./data/iphone-15-pro.json")
        .then(response => response.json())
        .then(data => {
            shopData = data;
            initializeSwiper(); //呼叫 initializeSwiper()，用來初始化 Swiper 輪播元件，並傳遞商店數據作為參數。
        })
        .catch(err => {
            console.error(`Error loading data: ${err}`);
        });
}

//initializeSwiper 函數初始化了一個輪播元件，用於展示產品圖片。
function initializeSwiper() {
    window.mySwiper = new Swiper('.swiper-container', {//new instance
        loop: true,//設置 Swiper 輪播元件循環播放。
        pagination: {//設置輪播元件的分頁。
            el: '.swiper-pagination',//指定分頁元素的CSS選擇器。
            clickable: true,//允許用戶點擊分頁來切換輪播。
        },
        navigation: {//設置輪播元件的導航（前進和後退箭頭）。
            nextEl: '.swiper-button-next',//指定下一個箭頭的CSS選擇器。
            prevEl: '.swiper-button-prev',//指定上一個箭頭的CSS選擇器。
        },
        autoplay: {//設置自動播放。
            delay: 2500,//設置自動播放的延遲時間為2.5秒。
            disableOnInteraction: false,//不禁用用戶互動後的自動播放。
        },
    });
}

//updateSwiperImages function根據所選的顏色更新 Swiper 中的圖片。
function updateSwiperImages(color) {
    const images = shopData.find(item => item.title === "iPhone 15 Pro").images[color];//從 shopData 中查找標題為 "iPhone 15 Pro" 的部分，然後取出指定顏色的圖片陣列。
    mySwiper.removeAllSlides();//清除 Swiper 中的所有幻燈片。
    images.forEach(img => {
        mySwiper.appendSlide(`<div class="swiper-slide"><img src="${img}"></div>`);//將每個圖片添加到 Swiper 中作為新的幻燈片。
    });
}

//updateStorageOptions function根據所選的型號更新儲存選項。
function updateStorageOptions(modelName) {
    const modelData = shopData.find(item => item.title === modelName);//從 shopData 中查找指定型號的數據。
    const storageOptions = modelName === "iPhone 15 Pro" ? modelData.storage : modelData.storage.slice(-3);//根據型號選擇儲存選項，或者如果型號不是 "iPhone 15 Pro"，則只選擇最後三個儲存選項。
    const priceOptions = modelName === "iPhone 15 Pro" ? modelData.price : modelData.price.slice(-3);
    const storageDiv = document.querySelector('.storage');
    storageDiv.innerHTML = '';//清空儲存選項的內容。

    storageOptions.forEach((option, index) => {
        const price = priceOptions[index];//取出對應的價格。
        storageDiv.innerHTML += createStorageOptionHTML(option, price);
    });

    attachClickListenersToOptions('.specific');
}

//createStorageOptionHTML function 用於建立儲存選項的HTML標籤。
function createStorageOptionHTML(option, price) {
    return `
        <div class="col">
            <div class="border border-secondary-subtle rounded-3 p-4 d-flex justify-content-between specific" role="button">
                <div class="storage-spec">${option}</div>
                <div class="price">NT$ ${price}</div>
            </div>
        </div>`;
}

//attachClickListenersToOptions function用於附加click事件監聽器到動態建立的按鈕。
function attachClickListenersToOptions(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener('click', () => {
            resetButtonStyles(selector);//重置所有相同 selector 的元素的樣式。
            button.classList.add('border-primary', 'border-3');//將 button 元素的樣式設置為具有主要邊框和3像素寬度的邊框，以突顯選中的元素。
            document.querySelector('.final-price').textContent = button.querySelector('.price').textContent;//將 .final-price 元素的內容設置為所選按鈕的價格，以顯示最終選擇的價格。
        });
    });
}

//resetButtonStyles function用於重置按鈕的樣式。
function resetButtonStyles(selector) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.remove('border-primary', 'border-3', 'border-secondary-subtle');//從按鈕元素中移除主要邊框、3像素寬度的邊框和次要邊框樣式，以重置按鈕的外觀。
    });
}

// 主函式，當網頁載入完成後執行。
function main() {
     // 從伺服器獲取商店數據。
    fetchShopData();
    // 為每個顏色選項按鈕添加事件監聽器。
    document.querySelectorAll('.color-option').forEach(button => {
        button.addEventListener('click', () => {
             // 重置顏色選項按鈕的樣式。
            resetButtonStyles('.color-option');
            // 為被點擊的按鈕添加邊框樣式。
            button.classList.add('border-primary', 'border-3');
             // 取得被選中的顏色名稱。
            const color = button.querySelector('p').textContent; 
             // 更新Swiper圖片為選擇的顏色。
            updateSwiperImages(button.querySelector('p').id); 
            // 更新顯示選擇的顏色。
            document.querySelector('.picked-color').textContent = color;
            // 在產品項目中更新選擇的顏色。
            document.querySelector('.color').textContent = `Color: ${color}`; 
        });
    });
    // 為每個型號選項按鈕添加事件監聽器。
    document.querySelectorAll('.model').forEach(button => {
        button.addEventListener('click', () => {
             // 重置型號選項按鈕的樣式。
            resetButtonStyles('.model');
            // 為被點擊的按鈕添加邊框樣式。
            button.classList.add('border-primary', 'border-3');
            // 取得被選中的型號名稱。
            const modelName = button.textContent; 
            // 根據選擇的型號更新儲存選項。
            updateStorageOptions(button.id);
            // 在產品項目中更新選擇的型號。
            document.querySelector('.title').textContent = `Model: ${modelName}`; 
            // 重置顯示的價格。
            document.querySelector('.final-price').textContent = ''; 
        });
    });
     // 確保在儲存選項更新後呼叫此function以添加事件監聽器。
    attachClickListenersToOptions('.specific'); 
}

// 此function修改為當儲存選項被選擇時也設置顏色。
function attachClickListenersToOptions(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener('click', () => {
            // 重置按鈕的樣式。
            resetButtonStyles(selector);
            // 為被點擊的按鈕添加邊框樣式。
            button.classList.add('border-primary', 'border-3');
            // 在產品項目中更新選擇的價格。
            document.querySelector('.final-price').textContent = `Price: ${button.querySelector('.price').textContent}`; 
            // 確保即使在更改儲存選項後也顯示已選擇的顏色。
            const selectedColorText = document.querySelector('.picked-color').textContent;
            if (selectedColorText) {
                // 重新確認所選的顏色。
                document.querySelector('.color').textContent = `Color: ${selectedColorText}`; 
            }
        });
    });
}

//確保當整個網頁完全載入後，main function會被執行，初始化網頁的功能。
window.onload = main;
