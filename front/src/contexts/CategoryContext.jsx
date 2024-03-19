import React, { createContext, useContext, useState, useEffect } from "react";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    const response = await fetch("http://127.0.0.1:5000/category");
    const data = await response.json();
    setCategories(data.categories);
  };
  return (
    <CategoryContext.Provider value={{categories, fetchCategories}}>{children}</CategoryContext.Provider>
  );
};
