export class OrdersComponent {
  constructor(dataService) {
    this.dataService = dataService;
  }

  render() {
    const orders = this.dataService.getOrders();

    return `
      <div class="space-y-4 lg:space-y-6">
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
          <div>
            <h3 class="text-base lg:text-lg font-semibold text-gray-800">All Orders</h3>
            <p class="text-sm lg:text-base text-gray-600">Manage and track restaurant orders</p>
          </div>
          <button class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 touch-manipulation">
            <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
            New Order
          </button>
        </div>

        <!-- Filters -->
        <div class="card p-4 lg:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select class="input-field text-sm lg:text-base">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <input type="date" class="input-field text-sm lg:text-base">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Table</label>
              <select class="input-field text-sm lg:text-base">
                <option value="">All Tables</option>
                ${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">Table ${i + 1}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <input type="text" placeholder="Search orders..." class="input-field pl-10 text-sm lg:text-base">
                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
          ${orders.map(order => this.renderOrderCard(order)).join('')}
        </div>
      </div>
    `;
  }

  renderOrderCard(order) {
    const formattedTime = new Date(order.orderTime).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const statusClass = this.getStatusClass(order.status);
    
    return `
      <div class="card hover:shadow-md transition-shadow duration-200 p-4 lg:p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="min-w-0 flex-1">
            <h4 class="text-base lg:text-lg font-semibold text-gray-800 truncate">${order.id}</h4>
            <p class="text-xs lg:text-sm text-gray-600">Table ${order.table} • ${formattedTime}</p>
          </div>
          <span class="inline-flex px-2 py-1 text-xs lg:text-sm font-medium rounded-full ${statusClass} ml-2 flex-shrink-0">
            ${order.status}
          </span>
        </div>

        <div class="mb-4">
          <p class="font-medium text-gray-700 mb-2 text-sm lg:text-base">${order.customerName}</p>
          <div class="space-y-1 max-h-24 lg:max-h-32 overflow-y-auto">
            ${order.items.slice(0, 3).map(item => `
              <div class="flex justify-between text-xs lg:text-sm">
                <span class="text-gray-600 truncate">${item.quantity}x ${item.name}</span>
                <span class="text-gray-800 flex-shrink-0 ml-2">₹${(item.price * item.quantity).toFixed(0)}</span>
              </div>
            `).join('')}
            ${order.items.length > 3 ? `<div class="text-xs text-gray-500">+${order.items.length - 3} more items</div>` : ''}
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <span class="font-semibold text-gray-800 text-sm lg:text-base">Total: ₹${order.total.toFixed(0)}</span>
            <span class="text-xs px-2 py-1 rounded ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
              ${order.paymentStatus}
            </span>
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            ${this.renderStatusButtons(order)}
          </div>
        </div>
      </div>
    `;
  }

  renderStatusButtons(order) {
    const nextStatus = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'delivered'
    };

    const buttons = [];
    
    if (nextStatus[order.status]) {
      const buttonText = {
        preparing: 'Start Cooking',
        ready: 'Mark Ready',
        delivered: 'Deliver'
      }[nextStatus[order.status]];
      
      buttons.push(`
        <button class="flex-1 btn-primary text-xs lg:text-sm py-2 touch-manipulation" data-action="update-order-status" data-id="${order.id}" data-status="${nextStatus[order.status]}">
          ${buttonText}
        </button>
      `);
    }

    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      buttons.push(`
        <button class="px-3 py-2 text-xs lg:text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 touch-manipulation" data-action="update-order-status" data-id="${order.id}" data-status="cancelled">
          Cancel
        </button>
      `);
    }

    return buttons.join('');
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
