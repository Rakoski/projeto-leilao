import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import './PadraoLayout.css';

const PadraoLayout = ({ children }) => {

    return (
        <div className="layout-container">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
}
export default PadraoLayout;