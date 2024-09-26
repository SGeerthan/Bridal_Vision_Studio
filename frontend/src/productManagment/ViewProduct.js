import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TryOn from "../components/Fitton"; 

const ViewProduct = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(null); // Image selected for Try-On

  // Gender & Size Filters
  const [genderFilter, setGenderFilter] = useState({
    women: false,
    men: false,
  });
  const [sizeFilter, setSizeFilter] = useState({
    xsmall: false,
    small: false,
    medium: false,
    large: false,
    xlarge: false,
    xxlarge: false,
  });

  // Example categories
  const categories = ["All", "Coat", "Saree", "Jewellery", "Earring"];

  // Fetch products from the API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/getImages")
      .then((res) => {
        setImages(res.data);
        setFilteredImages(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle Gender Filter
  const handleGenderFilter = (gender) => {
    setGenderFilter((prev) => ({ ...prev, [gender]: !prev[gender] }));
  };

  // Handle Size Filter
  const handleSizeFilter = (size) => {
    setSizeFilter((prev) => ({ ...prev, [size]: !prev[size] }));
  };

  // Filter images when category, gender, size, or search query changes
  useEffect(() => {
    let filtered = images;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (image) => image.category === selectedCategory
      );
    }

    // Filter by gender
    const genderMatch =
      (genderFilter.women &&
        filtered.some((image) => image.gender === "Female")) ||
      (genderFilter.men && filtered.some((image) => image.gender === "Male")) ||
      (!genderFilter.women && !genderFilter.men); // No gender filter

    if (genderMatch) {
      filtered = filtered.filter(
        (image) =>
          (genderFilter.women && image.gender === "Female") ||
          (genderFilter.men && image.gender === "Male") ||
          (!genderFilter.women && !genderFilter.men)
      );
    }

    // Filter by size
    const sizeMatch =
      (sizeFilter.xsmall && filtered.some((image) => image.size === "XS")) ||
      (sizeFilter.small && filtered.some((image) => image.size === "S")) ||
      (sizeFilter.medium && filtered.some((image) => image.size === "M")) ||
      (sizeFilter.large && filtered.some((image) => image.size === "L")) ||
      (sizeFilter.xlarge && filtered.some((image) => image.size === "XL")) ||
      (sizeFilter.xxlarge && filtered.some((image) => image.size === "XXL")) ||
      (!sizeFilter.xsmall &&
        !sizeFilter.small &&
        !sizeFilter.medium &&
        !sizeFilter.large &&
        !sizeFilter.xlarge &&
        !sizeFilter.xxlarge); // No size filter

    if (sizeMatch) {
      filtered = filtered.filter(
        (image) =>
          (sizeFilter.xsmall && image.size === "XS") ||
          (sizeFilter.small && image.size === "S") ||
          (sizeFilter.medium && image.size === "M") ||
          (sizeFilter.large && image.size === "L") ||
          (sizeFilter.xlarge && image.size === "XL") ||
          (sizeFilter.xxlarge && image.size === "XXL") ||
          (!sizeFilter.xsmall &&
            !sizeFilter.small &&
            !sizeFilter.medium &&
            !sizeFilter.large &&
            !sizeFilter.xlarge &&
            !sizeFilter.xxlarge)
      );
    }

    // Filter by search query
    if (searchQuery !== "") {
      filtered = filtered.filter((image) =>
        image.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [selectedCategory, genderFilter, sizeFilter, searchQuery, images]);

  const handleImageOverlay = (image) => {
    setSelectedImage(image); // Set the selected image for the modal
    setShowModal(true); // Show the modal
  };
  return (
    <div>
      <Header />

      {/* Category Navigation */}
      <div className="flex justify-center bg-white p-4 border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 mx-2 text-sm font-medium border-b-2 ${
              selectedCategory === category
                ? "border-black"
                : "border-transparent"
            } hover:border-black`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex justify-center p-4 bg-white">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded-md w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      <div className="flex p-6">
        {/* Filter Section */}
        <div className="w-1/4 p-4 bg-white border rounded-lg shadow-lg">
          <h3 className="font-semibold text-gray-700">FILTER BY</h3>
          {/* Gender Filter */}
          <h3 className="font-semibold text-gray-700">PRODUCT FOR</h3>
          <div className="flex flex-col mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={genderFilter.women}
                onChange={() => handleGenderFilter("women")}
              />
              <span>Women</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={genderFilter.men}
                onChange={() => handleGenderFilter("men")}
              />
              <span>Men</span>
            </label>
          </div>

          {/* Size Filter */}
          <h3 className="font-semibold text-gray-700 mt-6">SIZE</h3>
          <div className="flex flex-col mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sizeFilter.xsmall}
                onChange={() => handleSizeFilter("xsmall")}
              />
              <span>XSmall</span>
            </label>

            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={sizeFilter.small}
                onChange={() => handleSizeFilter("small")}
              />
              <span>Small</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={sizeFilter.medium}
                onChange={() => handleSizeFilter("medium")}
              />
              <span>Medium</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={sizeFilter.large}
                onChange={() => handleSizeFilter("large")}
              />
              <span>Large</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={sizeFilter.xlarge}
                onChange={() => handleSizeFilter("xlarge")}
              />
              <span>XLarge</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={sizeFilter.xxlarge}
                onChange={() => handleSizeFilter("xxlarge")}
              />
              <span>XXLarge</span>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image._id}
              className="bg-white p-4 border rounded-lg shadow-lg"
            >
              <img
                src={image.imagePath}
                alt={image.name}
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-lg font-medium mb-2">{image.name}</h2>
              <p className="text-gray-600 mb-4">${image.price}</p>
              
             
              <div className="flex flex-col">
                <button
                    className="bg-black text-white px-4 py-2 rounded mb-2"
                    onClick={() => handleImageOverlay(image)}
                >
                    Try Fit On
                </button>
                <button
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Add to cart
                </button>
                </div>

            </div>
          ))}
        </div>
      </div>

    
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-medium mb-4">Try-On</h2>
            <TryOn image={selectedImage} /> {/* Pass the selected image to TryOn component */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => setShowModal(false)} // Close the modal
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ViewProduct;
