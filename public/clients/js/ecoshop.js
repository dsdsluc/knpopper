document.addEventListener("DOMContentLoaded", () =>{
// animation initializing-AOS
AOS.init();

// header-top-options-------------------------------
function selectBoxHandler(selector) {
  const countryTop = document.querySelector(`#${selector}`);
  const selectBoxBody = document.querySelector(`#${selector} .slectbox-body`);
  if (selectBoxBody.style.display === "none") {
    selectBoxBody.style.display = "block";
    if (countryTop) {
      let countryOption = countryTop.querySelectorAll(".all-option"),
        countryBtn_text = countryTop.querySelector(".item-text");
      countryOption.forEach((option) => {
        option.addEventListener("click", () => {
          let selectedOption = option.querySelector(".item-text").innerText;
          // countrybtn-text
          countryBtn_text.innerHTML = selectedOption;
          selectBoxBody.style.display = "none";
        });
      });
    }
  } else {
    selectBoxBody.style.display = "none";
  }
}



// additional heights for submenu
function heightanimation(ele) {
  const els = document.querySelectorAll(`#${ele}`);
  els.forEach((item) => {
    const height = item.scrollHeight;
    item.style.setProperty("--max-height", `${height}px`);
  });
}
heightanimation("subMenu");

// hero-swiper-------------------------------------
var swiper = new Swiper(".hero-swiper", {
  spaceBetween: 30,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  // autoplay: {
  //   delay: 2500,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// about-swiper-------------------------------------
var swiper = new Swiper(".about-swiper", {
  spaceBetween: 30,
  slidesPerView: 3,
  roundLengths: true,
  loop: true,
  loopAdditionalSlides: 30,
  // autoplay: {
  //   delay: 2500,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1260: {
      slidesPerView: 2.5,
    },
  },
});

// product-details-----------------------------------
var swiper = new Swiper(".product-bottom", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
});
var swiper2 = new Swiper(".product-top", {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});

// product-size-dropdown-------------------------------
let pdSize = document.querySelector(".product-size");
if (pdSize) {
  (pdBtn = pdSize.querySelector(".size-section")),
    (pdOption = pdSize.querySelectorAll(".option")),
    (pdBtn_Text = pdSize.querySelector(".size-text")),
    (pdBtn_Text2 = pdSize.querySelector(".toggle-btn2"));

  pdOption.forEach((option) => {
    pdBtn.addEventListener("click", () => pdSize.classList.toggle("active"));
    option.addEventListener("click", () => {
      let selectedOption = option.querySelector(".option-text").innerText;
      let selectedOption2 = option.querySelector(".option-measure").innerText;
      // pdbtn-text2
      pdBtn_Text.innerHTML = selectedOption;
      pdBtn_Text2.innerHTML = selectedOption2;

      pdSize.classList.remove("active");
    });
  });
}

// range slider----------------------------------------
function priceslider() {
  if ($("#slider-tooltips").length > 0) {
    var tooltipSlider = document.getElementById("slider-tooltips");

    // Định dạng giá trị cho slider (VNĐ)
    var formatForSlider = {
      from: function (formattedValue) {
        return Number(formattedValue.replace(/[^0-9]/g, "")); // Loại bỏ ký tự không phải số
      },
      to: function (numericValue) {
        return numericValue.toLocaleString("vi-VN") + " VNĐ"; // Định dạng số với dấu phân cách
      },
    };

    noUiSlider.create(tooltipSlider, {
      start: [24000, 346000], // Giá trị khởi tạo (VNĐ)
      connect: true,
      format: formatForSlider,
      range: {
        min: 10000, // Giá trị tối thiểu
        max: 1000000, // Giá trị tối đa
      },
    });

    // Phần tử hiển thị giá trị min/max
    var formatValues = [
      document.getElementById("slider-margin-value-min"),
      document.getElementById("slider-margin-value-max"),
    ];

    // Lắng nghe sự kiện cập nhật slider
    tooltipSlider.noUiSlider.on("update", function (values, handle, unencoded) {
      formatValues[0].innerHTML = "Giá từ: " + values[0]; // Cập nhật giá trị min
      formatValues[1].innerHTML = "Đến: " + values[1]; // Cập nhật giá trị max
    });
  }
}
priceslider();


// Dashboard-switch-----------------------------------
function switchDashboard() {
  const toggleBtn = document.querySelector(".switch-icon");
  toggleBtn.classList.toggle("active");
}

// modal-------------------------------------------
function modalAction(elemnt) {
  const moalMain = document.querySelector(elemnt);
  if (moalMain.classList.contains("active")) {
    moalMain.classList.remove("active");
  } else {
    moalMain.classList.add("active");
  }
}

// image-uploader

let uploadImg = document.querySelector("#upload-img");
let inputFile = document.querySelector("#input-file");
if (inputFile) {
  inputFile.onchange = function () {
    uploadImg.src = URL.createObjectURL(inputFile.files[0]);
  };
}

// image-uploader-2
let coverImg = document.querySelector("#cover-img");
let coverFile = document.querySelector("#cover-file");
if (coverFile) {
  coverFile.onchange = function () {
    coverImg.src = URL.createObjectURL(coverFile.files[0]);
  };
}

// countdown----------
function CountDown(lastDate) {
  const selectDay = document.getElementById("day");
  const selectHour = document.getElementById("hour");
  const selectMinute = document.getElementById("minute");
  const selectSecound = document.getElementById("second");
  if (selectDay && selectHour && selectMinute && selectSecound) {
    let showDate = "";
    let showHour = "";
    let showMinute = "";
    let showSecound = "";
    // count Down
    const provideDate = new Date(lastDate);
    // format date
    const year = provideDate.getFullYear();
    const month = provideDate.getMonth();
    const date = provideDate.getDate();
    const hours = provideDate.getHours();
    const minutes = provideDate.getMinutes();
    const seconds = provideDate.getSeconds();

    // date calculation logic
    const _seconds = 1000;
    const _minutes = _seconds * 60;
    const _hours = _minutes * 60;
    const _date = _hours * 24;
    const timer = setInterval(() => {
      const now = new Date();
      const distance =
        new Date(year, month, date, hours, minutes, seconds).getTime() -
        now.getTime();
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      showDate = Math.floor(distance / _date);
      showMinute = Math.floor((distance % _hours) / _minutes);
      showHour = Math.floor((distance % _date) / _hours);
      showSecound = Math.floor((distance % _minutes) / _seconds);
      selectDay.innerText = showDate < 10 ? `0${showDate}` : showDate;
      selectHour.innerText = showHour < 10 ? `0${showHour}` : showHour;
      selectMinute.innerText = showMinute < 10 ? `0${showMinute}` : showMinute;
      selectSecound.innerText =
        showSecound < 10 ? `0${showSecound}` : showSecound;
    }, 1000);
  }
}
// 2023-08-28T10:41:43.000000Z

CountDown("2024-12-28T10:41:43.000000Z");

// product-cart-increment-decrement
const productInfo = document.querySelector(".product-info");
if (productInfo) {
  const plus = document.querySelector(".plus"),
    minus = document.querySelector(".minus"),
    number = document.querySelector(".number");

  if (plus) {
    let plusAdd = 1;
    number.innerText = "0" + plusAdd;

    plus.addEventListener("click", () => {
      plusAdd++;
      plusAdd = plusAdd < 10 ? "0" + plusAdd : plusAdd;
      number.innerHTML = plusAdd;
    });

    minus.addEventListener("click", () => {
      if (plusAdd > 1) {
        plusAdd--;
        plusAdd = plusAdd < 10 ? "0" + plusAdd : plusAdd;
        number.innerHTML = plusAdd;
      }
    });
  }
}


const productCartPage = document.querySelector(".cart-section");
if (productCartPage) {
  const plusAll = document.querySelectorAll(".plus"),
    minusAll = document.querySelectorAll(".minus"),
    numberAll = document.querySelectorAll(".number"),
    mainPriceAll = document.querySelectorAll(".main-price"),
    totalPriceAll = document.querySelectorAll(".total-price");

  plusAll.forEach((item, i) => {
    item.addEventListener("click", () => {
      let quantity = parseInt(numberAll[i].innerText, 10);
      quantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
      
      quantity++; // Increase the quantity
      numberAll[i].innerText = quantity < 10 ? "0" + quantity : quantity;

      const price = parseFloat(mainPriceAll[i].innerText.replace("$", ""));
      const totalPrice = (price * quantity).toFixed(2);
      totalPriceAll[i].innerText = "$" + totalPrice;
    });
  });

  minusAll.forEach((item, i) => {
    item.addEventListener("click", () => {
      let quantity = parseInt(numberAll[i].innerText, 10);
      quantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

      if (quantity > 1) { // Prevents quantity from going below 1
        quantity--; // Decrease the quantity
        numberAll[i].innerText = quantity < 10 ? "0" + quantity : quantity;

        const price = parseFloat(mainPriceAll[i].innerText.replace("$", ""));
        const totalPrice = (price * quantity).toFixed(2);
        totalPriceAll[i].innerText = "$" + totalPrice;
      }
    });
  });
}

const btnClearAllCart = document.querySelector("[ btn-clear-all-cart]");
if(btnClearAllCart){
  btnClearAllCart.addEventListener("click",()=>{
    const tableBody = document.querySelector('.cart-section table tbody');
    if (tableBody) {
      
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
        const btnBackupCart = document.querySelector("[btn-backup-cart]");
        btnBackupCart.classList.remove("d-none");
        btnClearAllCart.classList.add("d-none");
      }
    }
  })
}

const btnBackupCart = document.querySelector("[btn-backup-cart]");
if(btnBackupCart){
  btnBackupCart.addEventListener("click",()=>{
    window.location.reload();
  })
}
const removeButtons = document.querySelectorAll('.remove-item');
if(removeButtons && removeButtons.length > 0){
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      
      const row = button.closest('tr');
      btnBackupCart.classList.remove("d-none")
      if (row) {
        row.remove();
      }
    });
  });
}

const updateCartButton = document.querySelector('.update-btn');

if (updateCartButton) {
  updateCartButton.addEventListener('click', () => {

     const cartItems = [];
      
     const rows = document.querySelectorAll('.cart-section table tbody tr.ticket-row');
     
     rows.forEach(row => {
       const productId = row.querySelector('span.minus').getAttribute('data-product-id');
       const quantity = parseInt(row.querySelector('.number').innerText, 10);

       cartItems.push({ productId, quantity });
    });
    const formUpdateCart = document.querySelector("[form-update-cart]");
    const inputDataUpdateCart = formUpdateCart.querySelector("[data-update-cart]");
    inputDataUpdateCart.value = JSON.stringify(cartItems);
    formUpdateCart.submit();
  });
}
// category submenu---------------------------------
let submenu = document.getElementById("subMenu");
let empt = document.querySelector(".empty");

const dropdownCategoryMenu = document.querySelectorAll("[dropdown-category-menu]");
if(dropdownCategoryMenu.length > 0){
  dropdownCategoryMenu.forEach(item=>{
    item.addEventListener("click",()=>{
      submenu.classList.toggle("open-dropdown");
      empt.classList.toggle("active");
    })
  })
}

const agreeCheckbox = document.getElementById('agree');
const submitButton = document.querySelector('button.shop-btn[type="submit"]');


if(agreeCheckbox && submitButton ){
   submitButton.style.opacity = 0.5
    agreeCheckbox.addEventListener('change', function () {
      if (agreeCheckbox.checked) {
          submitButton.disabled = false; 
          submitButton.style.opacity = 1
      } else {
          submitButton.disabled = true;  
          submitButton.style.opacity = 0.5
      }
  });
}
    

})

const formDeleteCart = document.querySelector("[form-delete-cart]");
const inputDeleteItemCart = document.querySelector("[data-delete-item-cart]");
const buttonsDelete = document.querySelectorAll("[remove-item]");

if (formDeleteCart && inputDeleteItemCart && buttonsDelete) {
    buttonsDelete.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Ngăn chặn hành động mặc định của nút

            const productId = button.getAttribute("data-product-id"); // Lấy ID sản phẩm từ data attribute
            inputDeleteItemCart.value = productId; // Cập nhật giá trị cho trường ẩn

            formDeleteCart.submit(); // Gửi form
        });
    });
}