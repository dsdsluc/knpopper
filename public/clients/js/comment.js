const submitReview = document.getElementById("submitReview");

if (submitReview) {
  submitReview.addEventListener("click", () => {
    const commentText = document.getElementById("commentText").value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const productId = document.querySelector('input[name="product_id"]').value;
    const userId = document.querySelector('input[name="user_id"]').value;

    // Gửi dữ liệu đến server qua Socket.IO
    socket.emit("CLIENT_SEND_COMMENT", {
      commentText,
      rating,
      productId,
      userId,
    });

    // Xóa nội dung trong textarea và bỏ chọn rating sau khi gửi
    document.getElementById("commentText").value = "";
    document.querySelector('input[name="rating"]:checked').checked = false;

    // Lắng nghe phản hồi từ server
    socket.on("COMMENT_SAVED", function (response) {
      if (response.success) {
        const newCommentWrapper = document.createElement("div");
        newCommentWrapper.classList.add("wrapper");

        newCommentWrapper.innerHTML = `
          <div class="wrapper-aurthor">
            <div class="wrapper-info">
              <div class="aurthor-img">
                <img src="/clients/images/homepage-one/aurthor-img-1.webp" alt="aurthor-img">
              </div>
              <div class="author-details">
                <h5>You</h5>
                <p>${
                  response.comment.user_id.address || "Location not available"
                }</p>
              </div>
            </div>
            <div class="ratings">
              <span class="star-rating">`;

        for (let num = 1; num <= 5; num++) {
          if (num <= response.comment.rating) {
            newCommentWrapper.innerHTML += `<i class="fas fa-star star-icon" style="color: #FFA800"></i>`;
          } else {
            newCommentWrapper.innerHTML += `<i class="far fa-star star-icon"></i>`;
          }
        }

        newCommentWrapper.innerHTML += `
              </span>
              <span>${response.comment.rating.toFixed(1)}</span>
            </div>
          </div>
          <div class="wrapper-description">
            <p class="wrapper-details">${response.comment.commentText}</p>
          </div>
        </div>`;

        const reviewWrapper = document.querySelector(".review-wrapper");
        reviewWrapper.appendChild(newCommentWrapper);

        reviewWrapper.scrollTop = reviewWrapper.scrollHeight;
      }
    });
  });
}
