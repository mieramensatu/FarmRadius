import React from "react";

function sidebar() {
  return (
    <>
      <header class="app-header">
        <div class="app-header-navigation">
          <div class="dashboard-submenu submenu">
            <a href="/dashboard">
              <span class="material-symbols-outlined"> dashboard </span>
              <span> Dashboard</span>
            </a>
          </div>
          <div class="management-product-submenu submenu" style="display: none">
            <a href="/management-product">
              <span class="material-symbols-outlined"> package_2 </span>
              <span> Products</span>
            </a>
            <div class="submenu-item">
              <a href="/management-product/categories">
                <span class="material-symbols-outlined"> category </span>
                <span class="text"> Categories </span>
              </a>
            </div>
          </div>
        </div>
        <div class="app-header-actions">
          <a href="/profile" class="user-profile">
            <span>Matheo Peterson</span>
            <span>
              <img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" />
            </span>
          </a>
          <div class="app-header-actions-buttons">
            <div class="icon-button">
              <i class="ph ph-magnifying-glass"></i>
            </div>
            <div class="icon-button">
              <i class="ph ph-bell"></i>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
