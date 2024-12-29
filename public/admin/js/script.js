document.addEventListener("DOMContentLoaded", function () {
  const thumbnailInput = document.querySelector("[upload-input]");
  const thumbnailPreview = document.querySelector("[upload-image]");
  if (thumbnailInput && thumbnailPreview) {
    thumbnailInput.addEventListener("change", function () {
      const file = thumbnailInput.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          thumbnailPreview.src = e.target.result;
          thumbnailPreview.style.display = "block"; // Show the image
        };

        reader.readAsDataURL(file);
      } else {
        thumbnailPreview.src = "";
        thumbnailPreview.style.display = "none"; // Hide the image if no file is selected
      }
    });
  }
  const coverInput = document.querySelector("#cover-file");
  const coverPreview = document.querySelector("#cover-img");
  if (coverInput && coverPreview) {
    coverInput.addEventListener("change", function () {
      const file = coverInput.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          coverPreview.src = e.target.result;
          coverPreview.style.display = "block"; // Show the image
        };

        reader.readAsDataURL(file);
      } else {
        coverPreview.src = "";
        coverPreview.style.display = "none"; // Hide the image if no file is selected
      }
    });
  }

  const formSearch = document.getElementById("searchForm");
  if (formSearch) {
    const url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent the default form submission

      const value = e.target.elements.query.value;

      if (value) {
        url.searchParams.set("query", value);
      } else {
        url.searchParams.delete("query");
      }

      window.location.href = url.href;
    });
  }

  const dropdownItems = document.querySelectorAll("[data-status]");

  if (dropdownItems) {
    dropdownItems.forEach((item) => {
      item.addEventListener("click", () => {
        const status = item.getAttribute("data-status");
        const url = new URL(window.location.href);

        if (status && status !== "all") {
          url.searchParams.set("status", status);
        } else {
          url.searchParams.delete("status");
        }

        window.location.href = url.toString();
      });
    });
  }

  const buttonChangeStatusProduct = document.querySelectorAll(
    "button[data-item-id]"
  );

  if (buttonChangeStatusProduct.length > 0) {
    buttonChangeStatusProduct.forEach((button) => {
      button.addEventListener("click", () => {
        const currentStatus = button.getAttribute("data-current-status");
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        const form = button.closest("form");
        form.querySelector('input[name="status"]').value = newStatus;
        form.submit();
      });
    });
  }
  const btnClose = document.querySelectorAll(".btn-close");
  if (btnClose.length > 0) {
    btnClose.forEach((button) => {
      button.addEventListener("click", () => {
        const alertMessage = button.closest(".message");
        if (alertMessage) {
          alertMessage.style.display = "none"; // Hide the alert message
        }
      });
    });
  }

  const btnFilterCategory = document.getElementById("filterBtnCategory");
  const checkBoxInputs = document.querySelectorAll(
    "input[check-box-filter-category]"
  );

  if (btnFilterCategory && checkBoxInputs.length > 0) {
    const url = new URL(window.location.href);

    btnFilterCategory.addEventListener("click", () => {
      // Select all checked checkboxes
      const inputChecked = document.querySelectorAll(
        "input[check-box-filter-category]:checked"
      );

      // Collect all selected category IDs
      const selectedCategoryIds = Array.from(inputChecked).map(
        (checkbox) => checkbox.value
      );

      if (selectedCategoryIds.length > 0) {
        url.searchParams.set(
          "product_category_id",
          selectedCategoryIds.join(",")
        );
      } else {
        url.searchParams.delete("product_category_id");
      }

      window.location.href = url.href;
    });
  }

  const tablePermission = document.querySelector("[table-permission]");
  if (tablePermission) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
      let result = [];
      const rows = tablePermission.querySelectorAll("[data-name]");
      rows.forEach((row) => {
        const name = row.getAttribute("data-name");
        const inputs = row.querySelectorAll("input");
        if (name == "id") {
          inputs.forEach((input) => {
            result.push({
              id: input.value,
              permissions: [],
            });
          });
        } else {
          inputs.forEach((item, index) => {
            const checked = item.checked;
            if (checked) {
              result[index].permissions.push(name);
            }
          });
        }
      });
      const formPermissions = document.querySelector("[form-permissions]");
      const input = formPermissions.querySelector("input");
      input.value = JSON.stringify(result);
      formPermissions.submit();
    });
  }

  // Data Permission
  const dataRole = document.querySelector("[data-role]");
  if (dataRole) {
    const roles = JSON.parse(dataRole.getAttribute("data-role"));
    const tablePermission = document.querySelector("[table-permission]");

    roles.forEach((role, index) => {
      const permissions = role.permissions;
      permissions.forEach((permission) => {
        const tr = tablePermission.querySelector(`tr[data-name=${permission}]`);
        const input = tr.querySelectorAll("input")[index];
        input.checked = true;
      });
    });
  }

  const formChangeMultiSatus = document.querySelector(
    "[form-change-multi-status]"
  );
  const dropdownItemsChangeMulti = document.querySelectorAll(
    "[data-change-multi]"
  );

  if (dropdownItemsChangeMulti.length > 0 && formChangeMultiSatus) {
    dropdownItemsChangeMulti.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedAction = item.getAttribute("data-change-multi");
        const inputType =
          formChangeMultiSatus.querySelector("input[name=type]");
        inputType.value = selectedAction;

        if (selectedAction == "change-position") {
          const inputsCheck = document.querySelectorAll(
            "input[check-box-change-status]:checked"
          );
          const inputIds =
            formChangeMultiSatus.querySelector("input[name=ids]");

          if (inputsCheck.length > 0) {
            let ids = [];
            inputsCheck.forEach((input) => {
              const id = input.value;
              const position = input
                .closest("tr")
                .querySelector("input[change-position]").value;
              ids.push(`${id}-${position}`);
            });
            const idsString = ids.join(",");
            inputIds.value = idsString;
            formChangeMultiSatus.submit();
          }
        } else if (selectedAction == "delete-all") {
          const inputsCheck = document.querySelectorAll(
            "input[check-box-change-status]:checked"
          );
          const inputIds =
            formChangeMultiSatus.querySelector("input[name=ids]");

          if (inputsCheck.length > 0) {
            let ids = [];
            inputsCheck.forEach((input) => {
              const id = input.value;
              ids.push(`${id}`);
            });
            const idsString = ids.join(",");
            inputIds.value = idsString;
            formChangeMultiSatus.submit();
          }
        } else if (selectedAction == "active") {
          const inputsCheck = document.querySelectorAll(
            "input[check-box-change-status]:checked"
          );
          const inputIds =
            formChangeMultiSatus.querySelector("input[name=ids]");

          if (inputsCheck.length > 0) {
            let ids = [];
            inputsCheck.forEach((input) => {
              const id = input.value;
              ids.push(`${id}`);
            });
            const idsString = ids.join(",");
            inputIds.value = idsString;
            formChangeMultiSatus.submit();
          }
        } else if (selectedAction == "inactive") {
          const inputsCheck = document.querySelectorAll(
            "input[check-box-change-status]:checked"
          );
          const inputIds =
            formChangeMultiSatus.querySelector("input[name=ids]");

          if (inputsCheck.length > 0) {
            let ids = [];
            inputsCheck.forEach((input) => {
              const id = input.value;
              ids.push(`${id}`);
            });
            const idsString = ids.join(",");
            inputIds.value = idsString;
            formChangeMultiSatus.submit();
          }
        }
      });
    });
  }

  const confirmButtons = document.querySelectorAll(".confirm-button");

  confirmButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default button behavior

      // Get the shop id from data attribute
      const shopId = button.getAttribute("data-item-id");

      // Find the form with the corresponding id
      const form = document.getElementById(`confirm-form-${shopId}`);

      if (form) {
        form.submit(); // Submit the form
      }
    });
  });

  const clearFiltersBtn = document.getElementById("clearFiltersBtn");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
      // Select all checkboxes in the filter form
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const filterForm = document.getElementById("filterForm");

      // Initialize a variable to track if any checkbox is checked
      let isAnyChecked = false;

      // Loop through each checkbox to determine if any are checked
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          isAnyChecked = true; // Set to true if any checkbox is checked
        }
      });

      // If any checkbox is checked, clear filters
      if (isAnyChecked) {
        // Uncheck each checkbox
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false; // Uncheck each checkbox
        });

        // Optional: Reset the form to its initial state
        filterForm.reset(); // Reset the form fields

        // Provide user feedback
        alert("Filters have been cleared!"); // Notify the user
      } else {
        // If no checkboxes are checked, provide feedback
        alert("No filters were applied."); // Notify the user that no filters were selected
      }

      // Redirect to the current page to clear query parameters
      window.location.href = window.location.pathname; // This reloads the page without any query parameters
    });
  }
});

function deleteOrder(orderId) {
  if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
    // Create a new form element
    const form = document.createElement("form");
    form.method = "POST"; // Use POST method
    form.action = `/admin/order/delete/${orderId}?_method=PATCH`; // Set the action to your PATCH endpoint

    // Optionally, add a hidden input to specify the action if needed
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "_method"; // This can be used if your server expects this to identify the method
    input.value = "PATCH"; // Change as per your server requirements
    form.appendChild(input);

    // Append the form to the body (it won't be visible to the user)
    document.body.appendChild(form);

    // Submit the form
    form.submit();
  }
}

const mainCheckbox = document.querySelector("#customCheck1"); // Checkbox "All" 
const childCheckboxes = document.querySelectorAll(
  "input[check-box-change-status]"
); // Checkbox con

if (mainCheckbox && childCheckboxes) {
  // Khi checkbox "All" thay đổi trạng thái
  mainCheckbox.addEventListener("change", function () {
    const isChecked = this.checked; // Kiểm tra trạng thái (đã chọn hay chưa chọn)
    childCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked; // Gán trạng thái của tất cả checkbox con theo checkbox chính
    });
  });

  // Đồng bộ hóa trạng thái checkbox "All" khi các checkbox con thay đổi
  childCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (!this.checked) {
        mainCheckbox.checked = false; // Nếu có checkbox con bị bỏ chọn, bỏ chọn checkbox chính
      } else if ([...childCheckboxes].every((cb) => cb.checked)) {
        mainCheckbox.checked = true; // Nếu tất cả checkbox con được chọn, chọn checkbox chính
      }
    });
  });
}

// 📝 Lấy các phần tử DOM
const productNameInput = document.getElementById("product-name");
const previewTitle = document.getElementById("preview-title");
const productCategoryInput = document.getElementById("product-categories");
const previewCategory = document.getElementById("preview-category");

// ✅ Cập nhật tiêu đề sản phẩm
if (productNameInput && previewTitle) {
  productNameInput.addEventListener("input", () => {
    const productName = productNameInput.value.trim();
    previewTitle.childNodes[0].textContent =
      productName || "Vui lòng nhập tên sản phẩm";
  });
}

// ✅ Cập nhật danh mục sản phẩm
if (productCategoryInput && previewCategory) {
  productCategoryInput.addEventListener("change", () => {
    const selectedCategory =
      productCategoryInput.options[productCategoryInput.selectedIndex]?.text;
    previewCategory.innerText = selectedCategory || "(Category)";
  });
}

// 📊 TÍNH TOÁN GIÁ VÀ GIẢM GIÁ
const initPricePreview = () => {
  const priceInput = document.getElementById("product-price");
  const discountInput = document.getElementById("product-discount");
  const previewPrice = document.getElementById("preview-price");
  const previewFinalPrice = document.getElementById("preview-final-price");
  const previewDiscount = document.getElementById("preview-discount");

  // Kiểm tra nếu các phần tử tồn tại
  if (priceInput && discountInput && previewPrice && previewFinalPrice && previewDiscount) {
    const calculateFinalPrice = () => {
      const price = parseFloat(priceInput.value) || 0;
      const discount = parseFloat(discountInput.value) || 0;

      const finalPrice = price - price * (discount / 100);
      return {
        price,
        discount,
        finalPrice: finalPrice > 0 ? finalPrice : 0,
      };
    };

    const updatePricePreview = () => {
      const { price, discount, finalPrice } = calculateFinalPrice();

      // Cập nhật giá gốc (bị gạch ngang)
      previewPrice.innerText = `$${price.toFixed(2)}`;
      previewPrice.style.textDecoration = discount > 0 ? "line-through" : "none";

      // Cập nhật giá cuối cùng
      previewFinalPrice.innerText = `$${finalPrice.toFixed(2)}`;

      // Cập nhật phần trăm giảm giá
      previewDiscount.innerText = discount > 0 ? `(${discount}% Off)` : "";
    };

    // 🎯 Lắng nghe sự kiện input
    priceInput.addEventListener("input", updatePricePreview);
    discountInput.addEventListener("input", updatePricePreview);

    // Khởi chạy lần đầu
    updatePricePreview();
  }
};

// 👟 TÍNH TOÁN SIZE (KÍCH THƯỚC)
const initSizePreview = () => {
  const sizeInputs = document.querySelectorAll('input[name="size"]');
  const previewSize = document.getElementById("preview-size");

  // Kiểm tra nếu các phần tử tồn tại
  if (sizeInputs.length > 0 && previewSize) {
    const updateSizePreview = () => {
      const selectedSizes = Array.from(sizeInputs)
        .filter((input) => input.checked)
        .map((input) => input.value); // Lấy value của các checkbox được chọn

      // Cập nhật vào phần preview
      previewSize.innerText =
        selectedSizes.length > 0 ? selectedSizes.join(", ") : "No size selected";
    };

    // 🎯 Lắng nghe sự kiện `change` trên các checkbox kích thước
    sizeInputs.forEach((input) => {
      input.addEventListener("change", updateSizePreview);
    });

    // Khởi chạy lần đầu
    updateSizePreview();
  }
};

// 🚀 HÀM KHỞI TẠO CHÍNH
const initPreviews = () => {
  initPricePreview();
  initSizePreview();
};

// 🎯 Gọi hàm khởi tạo khi trang tải xong
document.addEventListener("DOMContentLoaded", initPreviews);

const titleInput = document.getElementById("category-title");
const previewTitleCategory = document.getElementById("preview-title");
let previewStatus = document.querySelector("#preview-title span");

if (titleInput && previewTitleCategory) {
  titleInput.addEventListener("input", () => {
    // Giữ nguyên phần `span` (status) và chỉ thay đổi phần text
    const currentStatus = previewStatus ? previewStatus.outerHTML : "";
    previewTitleCategory.innerHTML = `${titleInput.value.trim() || "Untitled Category"} ${currentStatus}`;
  });
}

const statusInputs = document.querySelectorAll('input[name="status"]');

if (statusInputs.length > 0 && previewStatus) {
  statusInputs.forEach((radio) => {
    radio.addEventListener("change", () => {
      previewStatus.textContent = `(${radio.value})`;
    });
  });
}

// 🗂️ Parent Category Preview
const parentCategoryInput = document.getElementById("category-parents");
const previewParentCategory = document.getElementById("preview-parent-category");

if (parentCategoryInput && previewParentCategory) {
  parentCategoryInput.addEventListener("change", () => {
    const selectedCategory =
      parentCategoryInput.options[parentCategoryInput.selectedIndex]?.text;
    previewParentCategory.textContent = selectedCategory || "None";
  });
}