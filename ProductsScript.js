document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.querySelector(".product-container");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");
  fetchFilter();

  // Fetch and display all products initially
  fetchProducts("https://dummyjson.com/products");

  // Event listener for the search bar
  searchIcon.addEventListener("click", function () {
    if (
      searchInput.style.display === "none" ||
      searchInput.style.display === ""
    ) {
      searchInput.style.display = "block";
      searchInput.focus();
      document.querySelector(".right").style.flex = 3;
    } else {
      searchInput.style.display = "none";
      document.querySelector(".right").style.flex = 1;
    }
  });

  document.addEventListener("click", function (e) {
    if (!searchIcon.contains(e.target) && !searchInput.contains(e.target)) {
      searchInput.style.display = "none";
      document.querySelector(".right").style.flex = 1;
    }
  });

  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim();
    if (query) {
      fetch(`https://dummyjson.com/products/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          displayProducts(data.products);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      fetchProducts("https://dummyjson.com/products");
    }
  });

  var globalProducts;

  // Function to fetch products from the API
  function fetchProducts(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.products.length === 0 || data === "") {
          productContainer.innerHTML = "<p>No products found.</p>";
          return;
        }
        const products = getFilteredProducts(data.products);
        if (products.length == 0 || products === "") {
          productContainer.innerHTML = "<p>No products found.</p>";
          return;
        }
        globalProducts = products;
        displayProducts(products);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }

  // Function to display products
  function displayProducts(products) {
    productContainer.innerHTML = ""; // Clear existing products
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card-product-container");
      productCard.id = product.id;
      productCard.innerHTML = `
                <div class="product-image" >
                    <img src="${product.thumbnail}" alt="${product.title}" />
                    <div class="add-cart-btn">
                        <button>Add to Cart</button>
                    </div>
                </div>
                <div class="category-style">
                    <p>${product.category}</p>
                </div>
                <div class="product-name">
                    <p>${product.title}</p>
                </div>
                <div class="product-price-rating">
                    <p class="price">${product.price} $</p>
                    <p>${product.rating} <i class="fa-regular fa-star"></i></p>
                </div>
            `;

      productContainer.appendChild(productCard);
    });
    document.querySelectorAll(".card-product-container").forEach((card) => {
      card.addEventListener("click", (event) => {
        localStorage.setItem("ProductID", card.id);
        window.open("./productDetailsPage.html", "_self");
      });
    });
  }

  document.getElementById("min-price").addEventListener("change", function () {
    var category = document.getElementById("filter-categories-select").value;
    filterByCategory(category);
  });

  document.getElementById("max-price").addEventListener("change", function () {
    var category = document.getElementById("filter-categories-select").value;
    filterByCategory(category);
    filterByPrice();
  });

  document
    .getElementById("filter-categories-select")
    .addEventListener("change", function () {
      filterByCategory(this.value);
      filterByPrice();
    });

  document.querySelector(".filter-btn").addEventListener("click", function () {
    document.getElementById("filter-section").classList.toggle("active");
  });

  // Function to filter products by category
  function filterByCategory(val = undefined) {
    const selectedCategory = val;
    const url = `https://dummyjson.com/products/category/${selectedCategory}`;
    if (val == 0 || val == undefined) {
      fetchProducts("https://dummyjson.com/products");
    } else {
      fetchProducts(url);
    }
  }

  document
    .getElementById("filter-price-sort")
    .addEventListener("change", function () {
      filterByPrice();
    });

  function filterByPrice() {
    value = document.getElementById("filter-price-sort").value;
    if (value == 1) {
      globalProducts.sort((a, b) => a.price - b.price);
    } else if (value == 2) {
      globalProducts.sort((a, b) => b.price - a.price);
    } else if (value == 0) {
      globalProducts.sort((a, b) => a.id - b.id);
    }

    displayProducts(globalProducts);
  }

  // Function to filter products by price
  function getFilteredProducts(products) {
    const minValue = document.getElementById("min-price").value;
    const maxValue = document.getElementById("max-price").value;
    if (minValue != 0 || maxValue != 0) {
      var filteredPrice = products.filter(
        (product) => product.price >= minValue && product.price <= maxValue
      );
      console.log(filteredPrice);
      return filteredPrice;
    } else {
      return products;
    }
  }

  // Function to fetch categories from the API
  function fetchFilter() {
    const categorySelect = document.getElementById("filter-categories-select");
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        const categories = data;
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.slug;
          option.innerText = category.slug;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
});
