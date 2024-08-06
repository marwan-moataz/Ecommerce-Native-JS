const mainCategoryList = document.querySelector(".main-container");
const productItems = document.querySelector(".product-container");
const allCategories = document.querySelector(".categories-container");
const categoryTitle = document.querySelector(".title-category-product");
const openCategoryMobile = document.querySelector(".open-category-mobile");

function categoryProduct(url) {
  let productItem;
  fetch(url)
    .then((response) => response.json())
    .then((categoryDetail) => {
      productItems.innerHTML = ""; // Clear previous items
      categoryDetail.products.forEach((item) => {
        productItem = item;
        categoryTitle.innerText = `${item.category.toUpperCase()}`;
        productItems.innerHTML += `
          <div class="card-product-container" id="${item.id}">
            <div class="product-image">
              <img
                src="${item.thumbnail}"
                alt="category-img"
              />
              <div class="add-cart-btn">
                <button onclick="event.stopPropagation(); AddItemToCart(${item.id})">Add to Cart</button>
              </div>
            </div>
            <div class="category-style"><p>${item.category}</p></div>
            <div class="product-name"><p>${item.title}</p></div>
            <div class="product-price-rating">
              <p class="price">${item.price} $</p>
              <p>${item.rating} <i class="fa-regular fa-star"></i></p>
            </div>
          </div>`;
      });
      document.querySelectorAll(".card-product-container").forEach((card) => {
        card.addEventListener("click", (event) => {
          localStorage.setItem("ProductID", card.id);
          window.open("./productDetailsPage.html", "_self");
        });
      });
    });
}

const categoryUrl = localStorage.getItem("categoryUrl");
if (categoryUrl) {
  categoryProduct(categoryUrl);
}

export const fetchCategories = () => {
  fetch("https://dummyjson.com/products/categories")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((cat, index) => {
        let { slug, url } = cat; // Dummy JSON categories API returns an array of category names
        url = `https://dummyjson.com/products/category/${slug}`; // Construct the URL for fetching category products
        allCategories.innerHTML += `
        <div class="card-container" data-url="${url}">
          <div class="category-name"><p>${slug}</p></div>
        </div>`;
      });

      document.querySelectorAll(".card-container").forEach((card) => {
        card.addEventListener("click", function () {
          const categoryUrl = this.getAttribute("data-url");
          localStorage.setItem("categoryUrl", categoryUrl); // Store the URL in localStorage
          window.open("Product_Categories.html", "_self"); // Open in a new tab
        });
      });
    });
};
fetchCategories();
document.querySelector(".open-btn").addEventListener("click", function () {
  console.log("u clicked");
  mainCategoryList.style.left = "0px";
});
openCategoryMobile.addEventListener("click", function () {
  console.log("u clicked");
  mainCategoryList.style.left = "0px";
});

document.querySelector(".close-btn").addEventListener("click", function () {
  console.log("u clicked");
  mainCategoryList.style.left = "-100vw";
});
