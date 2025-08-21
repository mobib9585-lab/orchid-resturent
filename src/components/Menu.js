export class MenuComponent {
  constructor(dataService) {
    this.dataService = dataService;
  }

  render() {
    const menuItems = this.dataService.getMenuItems();
    const categories = [...new Set(this.dataService.getMenuItems().map(item => item.category))];

    return `
      <div class="space-y-4 lg:space-y-6">
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
          <div>
            <h3 class="text-base lg:text-lg font-semibold text-gray-800">Menu Management</h3>
            <p class="text-sm lg:text-base text-gray-600">Manage food items, prices, and availability</p>
          </div>
          <button class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 touch-manipulation" data-action="open-add-menu-modal">
            <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
            Add Menu Item
          </button>
        </div>

        <!-- Filters and Search -->
        <div class="card p-4 lg:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select class="input-field text-sm lg:text-base" id="categoryFilter">
                <option value="">All Categories</option>
                ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select class="input-field text-sm lg:text-base" id="availabilityFilter">
                <option value="">All Items</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select class="input-field text-sm lg:text-base">
                <option value="">All Prices</option>
                <option value="0-200">₹0 - ₹200</option>
                <option value="200-500">₹200 - ₹500</option>
                <option value="500+">₹500+</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <input type="text" placeholder="Search menu items..." class="input-field pl-10 text-sm lg:text-base" id="searchInput">
                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Items Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6" id="menuGrid">
          ${menuItems.map(item => this.renderMenuItem(item)).join('')}
        </div>

        <!-- Add Menu Item Modal -->
        <div id="addMenuModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Add New Menu Item</h3>
            <form id="addMenuForm" class="space-y-4">
              ${this.renderMenuFormFields(categories)}
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" class="btn-primary flex-1 touch-manipulation">Add Item</button>
                <button type="button" class="btn-secondary touch-manipulation" data-action="close-add-menu-modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Edit Menu Item Modal -->
        <div id="editMenuModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Edit Menu Item</h3>
            <form id="editMenuForm" class="space-y-4">
              <input type="hidden" name="id">
              ${this.renderMenuFormFields(categories)}
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" class="btn-primary flex-1 touch-manipulation">Save Changes</button>
                <button type="button" class="btn-secondary touch-manipulation" data-action="close-edit-menu-modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  renderMenuFormFields(categories) {
    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" required class="input-field text-sm lg:text-base" name="name">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select required class="input-field text-sm lg:text-base" name="category">
          ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
        <input type="number" required min="0" step="1" class="input-field text-sm lg:text-base" name="price">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows="3" class="input-field text-sm lg:text-base" name="description"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
        <input type="number" required min="1" class="input-field text-sm lg:text-base" name="preparationTime">
      </div>
    `;
  }

  renderMenuItem(item) {
    return `
      <div class="card hover:shadow-md transition-shadow duration-200 p-4 lg:p-6">
        <div class="relative mb-4">
          <img src="${item.image}" alt="${item.name}" class="w-full h-40 lg:h-48 object-cover rounded-lg">
          <div class="absolute top-2 right-2">
            <span class="px-2 py-1 text-xs font-medium rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              ${item.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <div class="absolute bottom-2 left-2">
            <span class="px-2 py-1 text-xs font-medium bg-white bg-opacity-90 rounded-full text-gray-800">
              ${item.category}
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <h4 class="text-base lg:text-lg font-semibold text-gray-800 line-clamp-1">${item.name}</h4>
            <p class="text-xs lg:text-sm text-gray-600 line-clamp-2">${item.description}</p>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-lg lg:text-xl font-bold text-primary-600">₹${item.price.toFixed(0)}</span>
            <div class="flex items-center text-xs lg:text-sm text-gray-600">
              <i data-lucide="clock" class="w-3 h-3 lg:w-4 lg:h-4 mr-1"></i>
              ${item.preparationTime} min
            </div>
          </div>

          <div class="flex items-center justify-between text-xs lg:text-sm text-gray-600">
            <span>Popularity: ${item.popularity}%</span>
            <span>${item.ingredients.length} ingredients</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 pt-3 border-t">
            <button class="flex-1 btn-primary text-xs lg:text-sm py-2 touch-manipulation" data-action="open-edit-menu-modal" data-id="${item.id}">
              <i data-lucide="edit" class="w-3 h-3 lg:w-4 lg:h-4 mr-1 pointer-events-none"></i>
              Edit
            </button>
            <button class="px-3 py-2 text-xs lg:text-sm ${item.available ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} rounded touch-manipulation" 
                    data-action="toggle-menu-item-availability" data-id="${item.id}">
              ${item.available ? 'Disable' : 'Enable'}
            </button>
            <button class="px-3 py-2 text-xs lg:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 touch-manipulation" data-action="delete-menu-item" data-id="${item.id}">
              <i data-lucide="trash-2" class="w-3 h-3 lg:w-4 lg:h-4 pointer-events-none"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
