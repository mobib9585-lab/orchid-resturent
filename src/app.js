import { DashboardComponent } from './components/Dashboard.js';
import { OrdersComponent } from './components/Orders.js';
import { MenuComponent } from './components/Menu.js';
import { ReviewsComponent } from './components/Reviews.js';
import { StaffComponent } from './components/Staff.js';
import { PaymentsComponent } from './components/Payments.js';
import { DataService } from './services/DataService.js';

export class RestaurantApp {
  constructor() {
    this.currentView = 'dashboard';
    this.dataService = new DataService();
    this.isMobileMenuOpen = false;
    this.components = {
      dashboard: new DashboardComponent(this.dataService),
      orders: new OrdersComponent(this.dataService),
      menu: new MenuComponent(this.dataService),
      reviews: new ReviewsComponent(this.dataService),
      staff: new StaffComponent(this.dataService),
      payments: new PaymentsComponent(this.dataService)
    };
  }

  init() {
    this.renderLayout();
    this.renderContent();
    this.attachEventListeners();
  }

  renderLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        <div id="sidebar-container"></div>
        <div class="flex-1 flex flex-col overflow-hidden">
          <div id="header-container"></div>
          <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6">
            <div id="main-content"></div>
          </main>
        </div>
      </div>
      <div id="mobile-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden hidden"></div>
    `;
    this.renderSidebar();
    this.renderHeader();
  }

  renderSidebar() {
    const menuItems = [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { id: 'orders', icon: 'clipboard-list', label: 'Orders' },
      { id: 'menu', icon: 'utensils', label: 'Menu Items' },
      { id: 'reviews', icon: 'star', label: 'Reviews' },
      { id: 'staff', icon: 'users', label: 'Staff' },
      { id: 'payments', icon: 'credit-card', label: 'Payments' }
    ];

    const sidebarContainer = document.getElementById('sidebar-container');
    sidebarContainer.innerHTML = `
      <div id="sidebar" class="bg-white w-64 shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative h-full z-50">
        <div class="p-4 lg:p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orchid-500 to-primary-500 rounded-lg flex items-center justify-center">
                <i data-lucide="flower" class="w-4 h-4 lg:w-6 lg:h-6 text-white"></i>
              </div>
              <div>
                <h1 class="text-lg lg:text-xl font-bold text-gray-800">ORCHID</h1>
                <p class="text-xs lg:text-sm text-gray-600">Restaurant</p>
              </div>
            </div>
            <button class="lg:hidden p-2 text-gray-600" data-action="toggle-mobile-menu">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        
        <nav class="mt-4 lg:mt-6 px-3 lg:px-4">
          ${menuItems.map(item => `
            <div class="sidebar-item ${this.currentView === item.id ? 'active' : ''}" data-action="switch-view" data-view="${item.id}">
              <i data-lucide="${item.icon}" class="w-5 h-5"></i>
              <span class="font-medium text-sm lg:text-base">${item.label}</span>
            </div>
          `).join('')}
        </nav>
        
        <div class="absolute bottom-0 w-64 p-3 lg:p-4 border-t border-gray-200 bg-white">
          <div class="text-xs text-gray-500">
            <p class="font-medium">Hotel Daftari, 2nd Floor</p>
            <p>Pachimpally Chowk</p>
            <p>Kishanganj, Bihar 855107</p>
          </div>
        </div>
      </div>
    `;
  }

  renderHeader() {
    const headerContainer = document.getElementById('header-container');
    headerContainer.innerHTML = `
      <header class="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 lg:space-x-0 min-w-0">
            <button class="lg:hidden p-2 text-gray-600 -ml-2" data-action="toggle-mobile-menu">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
            <div class="min-w-0">
              <h2 class="text-xl lg:text-2xl font-bold text-gray-800 capitalize truncate">${this.currentView}</h2>
              <p class="text-sm lg:text-base text-gray-600 hidden sm:block">Manage your restaurant operations</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 lg:space-x-4">
            <div class="relative">
              <i data-lucide="bell" class="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 cursor-pointer"></i>
              <span class="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></span>
            </div>
            <div class="flex items-center space-x-2 lg:space-x-3">
              <div class="w-7 h-7 lg:w-8 lg:h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-xs lg:text-sm">A</span>
              </div>
              <span class="text-gray-700 font-medium text-sm lg:text-base hidden sm:block">Admin</span>
            </div>
          </div>
        </div>
      </header>
    `;
  }
  
  renderContent() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = this.components[this.currentView].render();
    lucide.createIcons();
  }

  attachEventListeners() {
    const appContainer = document.getElementById('app');

    appContainer.addEventListener('click', (e) => {
      const actionTarget = e.target.closest('[data-action]');
      if (!actionTarget) return;

      const { action, id, view, status } = actionTarget.dataset;

      switch (action) {
        case 'switch-view': this.switchView(view); break;
        case 'toggle-mobile-menu': this.toggleMobileMenu(); break;
        case 'update-order-status':
          this.dataService.updateOrderStatus(id, status);
          this.renderContent();
          break;
        case 'open-add-menu-modal': this.openModal('addMenuModal'); break;
        case 'close-add-menu-modal': this.closeModal('addMenuModal'); break;
        case 'open-edit-menu-modal': this.openEditMenuModal(id); break;
        case 'close-edit-menu-modal': this.closeModal('editMenuModal'); break;
        case 'toggle-menu-item-availability':
          this.dataService.toggleMenuItemAvailability(id);
          this.renderContent();
          break;
        case 'delete-menu-item':
          if (confirm('Are you sure you want to delete this menu item?')) {
            this.dataService.deleteMenuItem(id);
            this.renderContent();
          }
          break;
        case 'respond-to-review': 
          const response = prompt('Enter your response:');
          if (response) {
            this.dataService.addReviewResponse(id, response);
            this.renderContent();
          }
          break;
        case 'open-add-staff-modal': this.openModal('addStaffModal'); break;
        case 'close-add-staff-modal': this.closeModal('addStaffModal'); break;
        case 'open-edit-staff-modal': this.openEditStaffModal(id); break;
        case 'close-edit-staff-modal': this.closeModal('editStaffModal'); break;
        case 'toggle-staff-status':
          this.dataService.toggleStaffStatus(id);
          this.renderContent();
          break;
        case 'view-staff-details': alert(`Viewing details for staff ID: ${id}`); break;
        case 'view-payment-details': alert(`Viewing details for payment ID: ${id}`); break;
        case 'initiate-refund':
          if (confirm('Are you sure you want to refund this payment?')) {
            this.dataService.initiateRefund(id);
            this.renderContent();
          }
          break;
        case 'download-receipt': alert(`Downloading receipt for payment ID: ${id}`); break;
      }
    });

    appContainer.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (form.id === 'addMenuForm') {
        this.dataService.addMenuItem(data);
        this.closeModal('addMenuModal');
      }
      if (form.id === 'editMenuForm') {
        this.dataService.updateMenuItem(data.id, data);
        this.closeModal('editMenuModal');
      }
      if (form.id === 'addStaffForm') {
        this.dataService.addStaffMember(data);
        this.closeModal('addStaffModal');
      }
      if (form.id === 'editStaffForm') {
        this.dataService.updateStaff(data.id, data);
        this.closeModal('editStaffModal');
      }
      this.renderContent();
    });
    
    document.getElementById('mobile-overlay')?.addEventListener('click', () => this.toggleMobileMenu());
    
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
        this.toggleMobileMenu(false);
      }
    });
  }

  toggleMobileMenu(forceState) {
    this.isMobileMenuOpen = typeof forceState === 'boolean' ? forceState : !this.isMobileMenuOpen;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    if (this.isMobileMenuOpen) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  }

  switchView(view) {
    if (this.currentView !== view) {
      this.currentView = view;
      this.renderContent();
      this.renderSidebar(); // Re-render to update active state
      this.renderHeader(); // Re-render to update title
      lucide.createIcons();
      
      if (this.isMobileMenuOpen) {
        this.toggleMobileMenu(false);
      }
    }
  }

  openModal(modalId) {
    document.getElementById(modalId)?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      const form = modal.querySelector('form');
      if (form) form.reset();
    }
    document.body.style.overflow = 'auto';
  }

  openEditMenuModal(id) {
    const item = this.dataService.getMenuItems().find(m => m.id === id);
    if (!item) return;

    const modal = document.getElementById('editMenuModal');
    if (!modal) return;

    modal.querySelector('input[name="id"]').value = item.id;
    modal.querySelector('input[name="name"]').value = item.name;
    modal.querySelector('select[name="category"]').value = item.category;
    modal.querySelector('input[name="price"]').value = item.price;
    modal.querySelector('textarea[name="description"]').value = item.description;
    modal.querySelector('input[name="preparationTime"]').value = item.preparationTime;
    
    this.openModal('editMenuModal');
  }

  openEditStaffModal(id) {
    const member = this.dataService.getStaff().find(s => s.id === id);
    if (!member) return;

    const modal = document.getElementById('editStaffModal');
    if (!modal) return;

    modal.querySelector('input[name="id"]').value = member.id;
    modal.querySelector('input[name="name"]').value = member.name;
    modal.querySelector('select[name="position"]').value = member.position;
    modal.querySelector('input[name="email"]').value = member.email;
    modal.querySelector('input[name="phone"]').value = member.phone;
    modal.querySelector('input[name="salary"]').value = member.salary;
    modal.querySelector('select[name="shift"]').value = member.shift;
    
    this.openModal('editStaffModal');
  }
}
