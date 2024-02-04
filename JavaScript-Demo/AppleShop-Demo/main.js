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

//main function是整個內容的主要初始化函數，它調用其他函數來設置點擊事件監聽器，並在頁面加載完成後執行。
function main() {//main 的主初始化函式，這是整個內容的進入點。
    fetchShopData();
    document.querySelectorAll('.color-option').forEach(button => {
        button.addEventListener('click', () => {
            resetButtonStyles('.color-option');//呼叫resetButtonStyles()方法，重置所有顏色選項按鈕的樣式。
            button.classList.add('border-primary', 'border-3');
            const color = button.querySelector('p').id;//取所選顏色選項的ID。
            updateSwiperImages(color);//呼叫updateSwiperImages方法，根據選擇的顏色更新 Swiper 中的圖片。
            document.querySelector('.picked-color').textContent = button.querySelector('p').textContent;//將 .picked-color 元素的內容設置為所選顏色的文字，以顯示所選的顏色。
        });
    });
    // 選擇所有型號選項按鈕
    document.querySelectorAll('.model').forEach(button => {
        button.addEventListener('click', () => {
            resetButtonStyles('.model');//呼叫resetButtonStyles方法，重置所有型號選項按鈕的樣式。
            button.classList.add('border-primary', 'border-3');
            const modelName = button.id;//取得所選型號選項的ID。
            updateStorageOptions(modelName);//呼叫updateStorageOptions方法，根據所選的型號更新儲存選項。
            document.querySelector('.title').textContent = button.textContent;//將 .title 元素的內容設置為所選型號的文字，以顯示所選的型號。
            document.querySelector('.final-price').textContent = ''; // 清除 .final-price 元素的內容，以重置最終價格的顯示。
        });
    });
}
//確保當整個網頁完全載入後，main function會被執行，初始化網頁的功能。
window.onload = main;
