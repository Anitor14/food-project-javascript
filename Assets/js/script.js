async function initialize() {
  const baseUrl = "foods.json";
  let foodProducts;
  try {
    const response = await fetch(baseUrl);
    foodProducts = await response.json();
    console.log(foodProducts);
  } catch (error) {
    console.log(error);
  }

  //caching the dom.
  const category = document.querySelector("#category");
  const searchTerm = document.querySelector("#searchTerm");
  const searchBtn = document.querySelector("button");
  const main = document.querySelector("main");

  let lastCategory = category.value;
  // no search has been made.
  let lastSearch = "";

  let categoryGroup;
  let finalGroup;

  // this happens initially.
  finalGroup = foodProducts;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  searchBtn.addEventListener("click", selectCategory);

  function selectCategory(e) {
    e.preventDefault();
    // set the category group and final group to empty.
    categoryGroup = [];
    finalGroup = [];

    if (
      category.value === lastCategory &&
      searchTerm.value.trim() === lastSearch
    ) {
      return;
    } else {
      //update teh record of last category and search term.
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      if (category.value === "All") {
        categoryGroup = foodProducts;
        selectProducts();
      } else {
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = foodProducts.filter((product) => {
          return product.type === lowerCaseType;
        });
        selectProducts();
      }
    }
  }

  function selectProducts() {
    if (searchTerm.value.trim() === "") {
      finalGroup = categoryGroup;
    } else {
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      finalGroup = categoryGroup.filter((product) => {
        return product.name.includes(lowerCaseSearchTerm);
      });
    }
    updateDisplay();
  }
  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    if (finalGroup.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No results to display.";
      main.appendChild(para);
    } else {
      for (const product of finalGroup) {
        fetchBlob(product);
      }
    }
  }

  async function fetchBlob(product) {
    const url = `Assets/images/${product.image}`;
    try {
      const response = await fetch(url);
      const responseBlob = await response.blob();
      showProduct(responseBlob, product);
    } catch (error) {
      console.log(error);
    }
  }

  function showProduct(blob, product) {
    const objectURL = URL.createObjectURL(blob);

    const section = document.createElement("section");
    const heading = document.createElement("h2");
    const para = document.createElement("p");
    const image = document.createElement("img");

    section.setAttribute("class", product.type);

    heading.textContent = product.name.replace(
      product.name.charAt(0),
      product.name.charAt(0).toUpperCase()
    );

    para.textContent = `$${product.price.toFixed(2)}`;

    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}

initialize();
