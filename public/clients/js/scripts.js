const formAddToCart = document.querySelector("[card-add-item]");
const buttonAddToCart = document.querySelector("[button-add-to-cart]");

if (formAddToCart  && buttonAddToCart ) {
  buttonAddToCart.addEventListener("click", () => {
    formAddToCart.submit();
  });
}

// Alert handling
const alertSuccess = document.querySelector("[show-alert]");
if (alertSuccess) {
  const time = parseInt(alertSuccess.getAttribute("data-time")) || 3000;
  setTimeout(() => alertSuccess.classList.add("alert-none"), time);

  alertSuccess.querySelector("[close-alert]").addEventListener("click", () => {
    alertSuccess.classList.add("alert-none");
  });
}

const btnSearchHeader = document.querySelector("[btn-search-header]");
const formSearch = document.querySelector("[form-search]");
if (btnSearchHeader && formSearch) {
  const url = new URL(window.location.href);
  btnSearchHeader.addEventListener("click", () => {
    const inputSearch = formSearch.querySelector("input");
    if (inputSearch.value) {
      formSearch.submit();
    } else {
      url.searchParams.delete("query");
      window.location.href = url.href;
    }
  });
}

// Lấy các trường nhập liệu
const addressInput = document.getElementById("address");
const citySelect = document.getElementById("city");
const addressShipping = document.getElementById("address-shipping");
if (addressInput && citySelect && addressShipping) {
  addressInput.addEventListener("input", updateShippingAddress);
  citySelect.addEventListener("change", updateShippingAddress);

  // Hàm cập nhật địa chỉ giao hàng
  function updateShippingAddress() {
    const address = addressInput.value;
    const city = citySelect.options[citySelect.selectedIndex].text;

    addressShipping.textContent = `${address}, ${city}`;
  }
}


const formUploadPersonalInformation = document.querySelector(
  "[form-upload-personal-information]"
);
const buttonUploadPersonalInformation = document.querySelector(
  "[button-upload-personal-information]"
);

if (formUploadPersonalInformation && buttonUploadPersonalInformation) {
  buttonUploadPersonalInformation.addEventListener("click", function (event) {
    event.preventDefault();

    formUploadPersonalInformation.submit();
  });
}

function modalAction(elemnt) {
  const moalMain = document.querySelector(elemnt);
  if (moalMain.classList.contains("active")) {
    moalMain.classList.remove("active");
  } else {
    moalMain.classList.add("active");
  }
}

// category submenu---------------------------------
let submenu = document.getElementById("subMenu");
let empt = document.querySelector(".empty");

function tooglmenu() {
  submenu.classList.toggle("open-dropdown");
  empt.classList.toggle("active");
}

function selectBoxHandler(elementId) {
  const dropdown = document.querySelector(`#${elementId} .slectbox-body`);

  // Check if the dropdown is currently displayed
  if (dropdown.style.display === "none" || !dropdown.style.display) {
    // Hide other open dropdowns if necessary
    document.querySelectorAll(".slectbox-body").forEach((box) => {
      box.style.display = "none";
    });

    // Show the selected dropdown
    dropdown.style.display = "block";
  } else {
    // Hide the dropdown
    dropdown.style.display = "none";
  }
}

/**
 * Toggle the visibility of the dropdown.
 * @param {string} elementId - The ID of the dropdown container.
 */
function toggleDropdown(elementId) {
  const dropdown = document.querySelector(`#${elementId} .slectbox-body`);
  const isVisible = dropdown.style.display === "block";

  // Hide all dropdowns
  document.querySelectorAll(".slectbox-body").forEach((box) => {
    box.style.display = "none";
  });

  // Show the clicked dropdown if it was not already visible
  if (!isVisible) {
    dropdown.style.display = "block";
  }
}

/**
 * Redirect the user to a new URL with the sort option.
 * @param {string} sortOption - The selected sort option (e.g., 'price_asc', 'price_desc').
 */
function redirectWithSortOption(sortOption) {
  const currentUrl = new URL(window.location.href);

  // Update the URL's query parameters
  currentUrl.searchParams.set("sort", sortOption);

  // Redirect to the updated URL
  window.location.href = currentUrl.toString();
}

const form = document.getElementById("filterForm");

if (form) {
  // Xử lý sự kiện submit form
  form.addEventListener("submit", function (event) {
    const checkboxes = document.querySelectorAll(
      "input[name='categories[]']:checked"
    );

    if (checkboxes.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục sản phẩm.");
      event.preventDefault();
    } else {
      const selectedCategories = Array.from(checkboxes).map(
        (checkbox) => checkbox.value
      );
      console.log("Danh mục đã chọn:", selectedCategories);
    }
  });
}


// Tìm phần tử nút Apply
const applyCouponButton = document.querySelector('[apply-coupons]');
const couponInput = document.querySelector('[coupon-input]');

// Kiểm tra xem nút Apply có tồn tại không trước khi gắn sự kiện
if (applyCouponButton && couponInput) {
  applyCouponButton.addEventListener('click', () => {
    // Lấy giá trị coupon từ input
    const couponCode = couponInput.value.trim();

    // Kiểm tra nếu coupon code không rỗng
    if (!couponCode) {
      alert('Vui lòng nhập mã giảm giá!');
      return;
    }

    // Chuyển hướng với query string ?coupon=value
    window.location.href = `${window.location.pathname}?coupon=${encodeURIComponent(couponCode)}`;
  });
}


const buttonAddToCartAll = document.querySelectorAll("[btn-add-to-cart]");
if(buttonAddToCartAll.length > 0 && buttonAddToCartAll){
  buttonAddToCartAll.forEach(item=>{
    item.addEventListener("click", ()=>{
      // goi ra cai form gan nhat cung cap voi no roi submit
      const form = item.closest(".product-cart-btn").querySelector("form[card-add-item]");
      if(form){
        form.submit();
      }
    })
  })
}