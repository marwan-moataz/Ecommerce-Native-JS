let productData = {};
const productOverviewSection = document.querySelector(".porductOverview");
const productDetailsSection = document.querySelector(".productInformation");
const reviewsCount = document.querySelector(".revCount");
const mobileNavMenu = document.querySelector(".mobile-nav");
const mobileBurgerBtn = document.querySelector(".mobileBurgerBtn");
const mobileCloseBtn = document.querySelector(".mobileCloseBtn");

const fetchProductData = async (productID) => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productID}`);
    const jsonData = await response.json();
    productData = { ...jsonData };
    reviewsCount.textContent = productData.reviews.length;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
};
const sidePhotoClickHandler = (url) => {
  const mainPhoto = document.querySelector(".mainImage");
  mainPhoto.src = url;
};
const renderSingleProduct = async (productID = 15) => {
  await fetchProductData(productID);

  productOverviewSection.innerHTML = ` <div class="currDirectory">
        <p>Products</p>
        <i class="bx bx-chevron-right"></i>
        <p>${productData.category}</p>
        <i class="bx bx-chevron-right"></i>
        <p>${productData.title}</p>
      </div>
      <div class="productEssintials">
        <div class="productImages">
          <aside>
          ${productData.images
            .map((img) => {
              return `<button onclick="sidePhotoClickHandler(\`${img}\`)">
              <img src="${img}" alt="" />
            </button>`;
            })
            .join("")}
          </aside>
          <div class="mainImageContainer">
            <img
                class="mainImage"
              src="${productData.images[0]}"
              alt=""
            />
          </div>
        </div>
        <div class="productInfo">
          <div>
            <h2 class="productName">${productData.title}</h2>
            <h2 class="price">$${productData.price}</h2>
            <h3 class="description">
            ${productData.description}
            </h3>
          </div>
          <form class="numberOfItems">
            <div class="quantity">
              <button class="op" onclick = "operationBtnHandler(event , '-')" > - </button>
              <div class="qun">1</div>
              <button class="op" onclick = "operationBtnHandler(event , '+')" > + </button>
            </div>
            <button class="addBtn" onclick="event.preventDefault(); AddItemToCart(${
              productData.id
            })">Add to Cart</button>
          </form>
        </div>
      </div>`;
  productDetailsNavHandler();
};

const productDetailsNavHandler = (event = null, me = {}) => {
  if (me.id == "productRev") {
    productDetailsSection.innerHTML = `${productData.reviews
      .map((item) => {
        return `<div class="reviews">
          <div class="reviewer">
            <h2 class="reviewerName">${item.reviewerName}</h2>
            <div class="rating">
              <input value="5" name="${item.comment}" 
              id="star5_${item.comment}" 
              type="radio" disabled 
              ${Math.floor(item.rating) === 5 ? "checked" : ""}>
              <label for="star5_${item.comment}"></label>
              
              <input value="4" name="${item.comment}" 
              id="star4_${item.comment}" 
              type="radio" disabled 
              ${Math.floor(item.rating) === 4 ? "checked" : ""}>
              <label for="star4_${item.comment}"></label>
              
              <input value="3" name="${item.comment}" 
              id="star3_${item.comment}" 
              type="radio" disabled 
              ${Math.floor(item.rating) === 3 ? "checked" : ""}>
              <label for="star3_${item.comment}"></label>

              <input value="2" name="${item.comment}" 
              id="star2_${item.comment}" 
              type="radio" disabled 
              ${Math.floor(item.rating) === 2 ? "checked" : ""}>
              <label for="star2_${item.comment}"></label>
              
              <input value="1" name="${item.comment}" 
              id="star1_${item.comment}" 
              type="radio" disabled 
              ${Math.floor(item.rating) === 1 ? "checked" : ""}>
              <label for="star1_${item.comment}"></label>
            </div>
                      </div>
          <p class="comment">${item.comment}
          </p>
        </div>`;
      })
      .join("")}`;
  } else if (me.id == "writeNewRev") {
    productDetailsSection.innerHTML = `<div class="newReview">
          <div class="newReviewHeading">
            <h2>Add a review</h2>
            <h3>
              Your email address will not be published. Required fields are
              marked*
            </h3>
          </div>
          <div class="newRating">
            <h3>Your Rating</h3>
            <div class="rating">
              <input value="5" name="rating" id="star5" type="radio">
              <label for="star5"></label>
              <input value="4" name="rating" id="star4" type="radio">
              <label for="star4"></label>
              <input value="3" name="rating" id="star3" type="radio">
              <label for="star3"></label>
              <input value="2" name="rating" id="star2" type="radio">
              <label for="star2"></label>
              <input value="1" name="rating" id="star1" type="radio">
              <label for="star1"></label>
            </div>
          </div>
          <form >
            <div class="reviewBody">
              <h3 for="reviewerComment">Your review</h3>
              <textarea
                name="reviewerComment"
                id="reviewerComment"
                cols="80"
                rows="7"
              ></textarea>
            </div>
            <div class="reviewerData">

              <div class="reviewerName">
                <h3 for="name">Name</h3>
                <input type="text" name="" id="" />
              </div>
              <div class="reviewerEmail">
                <h3 for="name">Email</h3>
                <input type="email" name="" id="" />
              </div>
            </div>
            <button type="submit" class="submitBtn">SUBMIT</button>
          </form>
        </div>
      </div>`;
  } else {
    productDetailsSection.innerHTML = `<div class="detailsContent">
        <div class="description">
          <p>
            ${productData.description}</p>
        </div>`;
  }
};

const operationBtnHandler = (event, op) => {
  event.preventDefault();
  const quantity = document.querySelector(".qun");
  if (op == "-" && +quantity.textContent > 1) {
    quantity.textContent = +quantity.textContent - 1;
  } else if (op == "+") {
    quantity.textContent = +quantity.textContent + 1;
  }
};

const sideMenuHandler = () => {
  mobileBurgerBtn.style.display = "none";
  mobileCloseBtn.style.display = "inline";
  mobileNavMenu.style.display = "block";
  mobileNavMenu.style.top = "100px";
};

const closeSideMenuHandler = () => {
  mobileBurgerBtn.style.display = "inline";
  mobileCloseBtn.style.display = "none";
  mobileNavMenu.style.top = "-300px";
};

renderSingleProduct(localStorage.getItem("ProductID"));
