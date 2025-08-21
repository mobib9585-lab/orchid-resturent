export class DashboardComponent {
  constructor(dataService) {
    this.dataService = dataService;
  }

  render() {
    const stats = this.dataService.getTodayStats();
    const { recentOrders, recentReviews } = this.dataService.getRecentActivity();

    return `
      <div class="space-y-4 lg:space-y-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          ${this.renderStatCard('Total Orders', stats.totalOrders, 'clipboard-list', 'text-blue-600', 'bg-blue-50')}
          ${this.renderStatCard('Revenue', `₹${stats.totalRevenue.toFixed(0)}`, 'indian-rupee', 'text-green-600', 'bg-green-50')}
          ${this.renderStatCard('Avg Order', `₹${stats.avgOrderValue.toFixed(0)}`, 'trending-up', 'text-purple-600', 'bg-purple-50')}
          ${this.renderStatCard('Active Staff', stats.activeStaff, 'users', 'text-orange-600', 'bg-orange-50')}
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <!-- Recent Orders -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base lg:text-lg font-semibold text-gray-800">Recent Orders</h3>
              <i data-lucide="more-horizontal" class="w-5 h-5 text-gray-400 cursor-pointer"></i>
            </div>
            <div class="space-y-3">
              ${recentOrders.map(order => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-gray-800 text-sm lg:text-base truncate">${order.id}</p>
                    <p class="text-xs lg:text-sm text-gray-600 truncate">${order.customerName} - Table ${order.table}</p>
                  </div>
                  <div class="text-right ml-3">
                    <p class="font-semibold text-gray-800 text-sm lg:text-base">₹${order.total.toFixed(0)}</p>
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(order.status)}">
                      ${order.status}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Reviews -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base lg:text-lg font-semibold text-gray-800">Recent Reviews</h3>
              <i data-lucide="more-horizontal" class="w-5 h-5 text-gray-400 cursor-pointer"></i>
            </div>
            <div class="space-y-3">
              ${recentReviews.map(review => `
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <p class="font-medium text-gray-800 text-sm lg:text-base truncate">${review.customerName}</p>
                    <div class="flex items-center ml-2">
                      ${Array.from({ length: 5 }, (_, i) => `
                        <i data-lucide="star" class="w-3 h-3 lg:w-4 lg:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>
                      `).join('')}
                    </div>
                  </div>
                  <p class="text-xs lg:text-sm text-gray-600 line-clamp-2">${review.comment.substring(0, 80)}...</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="text-base lg:text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            <button class="flex flex-col items-center p-3 lg:p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200 touch-manipulation" data-action="switch-view" data-view="orders">
              <i data-lucide="plus-circle" class="w-6 h-6 lg:w-8 lg:h-8 text-primary-600 mb-2 pointer-events-none"></i>
              <span class="text-xs lg:text-sm font-medium text-primary-700 text-center pointer-events-none">New Order</span>
            </button>
            <button class="flex flex-col items-center p-3 lg:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 touch-manipulation" data-action="open-add-menu-modal">
              <i data-lucide="utensils" class="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mb-2 pointer-events-none"></i>
              <span class="text-xs lg:text-sm font-medium text-green-700 text-center pointer-events-none">Add Menu Item</span>
            </button>
            <button class="flex flex-col items-center p-3 lg:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 touch-manipulation" data-action="open-add-staff-modal">
              <i data-lucide="user-plus" class="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mb-2 pointer-events-none"></i>
              <span class="text-xs lg:text-sm font-medium text-blue-700 text-center pointer-events-none">Add Staff</span>
            </button>
            <button class="flex flex-col items-center p-3 lg:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 touch-manipulation" data-action="switch-view" data-view="payments">
              <i data-lucide="bar-chart" class="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mb-2 pointer-events-none"></i>
              <span class="text-xs lg:text-sm font-medium text-purple-700 text-center pointer-events-none">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderStatCard(title, value, icon, iconColor, bgColor) {
    return `
      <div class="card p-4 lg:p-6">
        <div class="flex items-center">
          <div class="p-2 lg:p-3 rounded-lg ${bgColor} flex-shrink-0">
            <i data-lucide="${icon}" class="w-5 h-5 lg:w-6 lg:h-6 ${iconColor}"></i>
          </div>
          <div class="ml-3 lg:ml-4 min-w-0 flex-1">
            <p class="text-xs lg:text-sm font-medium text-gray-600 truncate">${title}</p>
            <p class="text-lg lg:text-2xl font-bold text-gray-900 truncate">${value}</p>
          </div>
        </div>
      </div>
    `;
  }

  getStatusClass(status) {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
