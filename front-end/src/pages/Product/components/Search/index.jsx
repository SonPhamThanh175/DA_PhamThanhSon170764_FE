import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchComponent.scss';

const SearchComponent = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/get-all');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className="search-component-container">
            <input
                className="search-component-input"
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-component-button">Tìm kiếm</button>
            {searchTerm && filteredProducts.length > 0 && (
                <ul className="search-component-results">
                    {filteredProducts.map((product) => (
                        <li key={product._id} className="search-component-item" onClick={() => handleProductClick(product._id)}>
                            <img src={product.images[0]} alt={product.name} width="50" />
                            <div>{product.name}</div>
                            {/* <div>{product.description}</div>
                            <div>Giá gốc: {product.originalPrice}</div> */}
                            <div>Giá khuyến mãi: {product.salePrice}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchComponent;
