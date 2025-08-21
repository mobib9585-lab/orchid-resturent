export class PaymentsComponent {
  constructor(dataService) {
    this.dataService = dataService;
  }

  render() {
    const payments = this.dataService.getPayments();
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const refundedAmount = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
    const failedPayments = payments.filter(p => p.status === 'failed').length;

    return `
      <div class="space-y-4 lg:space-y-6">
        <!-- Header -->
        <div>
          <h3 class="text-base lg:text-lg font-semibold text-gray-800">Payment Management</h3>
          <p class="text-sm lg:text-base text-gray-600">Track transactions, refunds, and payment analytics</p>
        </div>

        <!-- Payment Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="indian-rupee" class="w-5 h-5 lg:w-6 lg:h-6 text-green-600"></i>
            </div>
            <div class="text-lg lg:text-2xl font-bold text-gray-800">₹${totalRevenue.toFixed(0)}</div>
            <div class="text-xs lg:text-sm text-gray-600">Total Revenue</div>
          </div>
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="clock" class="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600"></i>
            </div>
            <div class="text-lg lg:text-2xl font-bold text-gray-800">₹${pendingAmount.toFixed(0)}</div>
            <div class="text-xs lg:text-sm text-gray-600">Pending</div>
          </div>
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="rotate-ccw" class="w-5 h-5 lg:w-6 lg:h-6 text-blue-600"></i>
            </div>
            <div class="text-lg lg:text-2xl font-bold text-gray-800">₹${refundedAmount.toFixed(0)}</div>
            <div class="text-xs lg:text-sm text-gray-600">Refunded</div>
          </div>
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="x-circle" class="w-5 h-5 lg:w-6 lg:h-6 text-red-600"></i>
            </div>
            <div class="text-lg lg:text-2xl font-bold text-gray-800">${failedPayments}</div>
            <div class="text-xs lg:text-sm text-gray-600">Failed</div>
          </div>
        </div>

        <!-- Payment Methods Distribution -->
        <div class="card p-4 lg:p-6">
          <h4 class="text-base lg:text-lg font-semibold text-gray-800 mb-4">Payment Methods</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            ${this.renderPaymentMethodStats(payments)}
          </div>
        </div>

        <!-- Filters -->
        <div class="card p-4 lg:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select class="input-field text-sm lg:text-base" id="statusFilter">
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select class="input-field text-sm lg:text-base" id="methodFilter">
                <option value="">All Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="date" class="input-field text-sm lg:text-base" id="fromDate">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input type="date" class="input-field text-sm lg:text-base" id="toDate">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <input type="text" placeholder="Transaction ID..." class="input-field pl-10 text-sm lg:text-base" id="searchInput">
                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments Table/Cards -->
        <div class="space-y-4">
          <!-- Desktop Table -->
          <div class="hidden lg:block card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${payments.map(payment => this.renderPaymentRow(payment)).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden space-y-3">
            ${payments.map(payment => this.renderPaymentCard(payment)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderPaymentMethodStats(payments) {
    const methods = ['cash', 'card', 'upi', 'wallet'];
    const methodStats = {};
    
    methods.forEach(method => {
      const methodPayments = payments.filter(p => p.method === method && p.status === 'completed');
      methodStats[method] = {
        count: methodPayments.length,
        amount: methodPayments.reduce((sum, p) => sum + p.amount, 0)
      };
    });

    const methodIcons = {
      cash: 'banknote',
      card: 'credit-card',
      upi: 'smartphone',
      wallet: 'wallet'
    };

    return methods.map(method => `
      <div class="text-center p-3 lg:p-4 bg-gray-50 rounded-lg">
        <div class="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 flex items-center justify-center">
          <i data-lucide="${methodIcons[method]}" class="w-4 h-4 lg:w-6 lg:h-6 text-gray-600"></i>
        </div>
        <div class="text-base lg:text-lg font-semibold text-gray-800">${methodStats[method].count}</div>
        <div class="text-xs lg:text-sm text-gray-600 capitalize">${method}</div>
        <div class="text-xs text-gray-500">₹${methodStats[method].amount.toFixed(0)}</div>
      </div>
    `).join('');
  }

  renderPaymentRow(payment) {
    const formattedDate = new Date(payment.date).toLocaleDateString();
    const statusClass = this.getStatusClass(payment.status);
    const methodIcon = this.getMethodIcon(payment.method);

    return `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div>
            <div class="text-sm font-medium text-gray-900">${payment.transactionId}</div>
            <div class="text-sm text-gray-500">Order: ${payment.orderId}</div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${payment.customerName}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">₹${payment.amount.toFixed(0)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <i data-lucide="${methodIcon}" class="w-4 h-4 text-gray-400 mr-2"></i>
            <span class="text-sm text-gray-900 capitalize">${payment.method}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
            ${payment.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formattedDate}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <button class="text-primary-600 hover:text-primary-900" data-action="view-payment-details" data-id="${payment.id}">
              <i data-lucide="eye" class="w-4 h-4 pointer-events-none"></i>
            </button>
            ${payment.status === 'completed' ? `
              <button class="text-blue-600 hover:text-blue-900" data-action="initiate-refund" data-id="${payment.id}">
                <i data-lucide="rotate-ccw" class="w-4 h-4 pointer-events-none"></i>
              </button>
            ` : ''}
            <button class="text-gray-600 hover:text-gray-900" data-action="download-receipt" data-id="${payment.id}">
              <i data-lucide="download" class="w-4 h-4 pointer-events-none"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  renderPaymentCard(payment) {
    const formattedDate = new Date(payment.date).toLocaleDateString();
    const statusClass = this.getStatusClass(payment.status);
    const methodIcon = this.getMethodIcon(payment.method);

    return `
      <div class="card p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-medium text-gray-900 truncate">${payment.transactionId}</h4>
            <p class="text-xs text-gray-500">Order: ${payment.orderId}</p>
            <p class="text-sm text-gray-700 mt-1 truncate">${payment.customerName}</p>
          </div>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass} ml-2 flex-shrink-0">
            ${payment.status}
          </span>
        </div>
        
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <i data-lucide="${methodIcon}" class="w-4 h-4 text-gray-400 mr-2"></i>
            <span class="text-sm text-gray-700 capitalize">${payment.method}</span>
          </div>
          <span class="text-base font-medium text-gray-900">₹${payment.amount.toFixed(0)}</span>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">${formattedDate}</span>
          <div class="flex space-x-2">
            <button class="p-1 text-primary-600 hover:text-primary-900 touch-manipulation" data-action="view-payment-details" data-id="${payment.id}">
              <i data-lucide="eye" class="w-4 h-4 pointer-events-none"></i>
            </button>
            ${payment.status === 'completed' ? `
              <button class="p-1 text-blue-600 hover:text-blue-900 touch-manipulation" data-action="initiate-refund" data-id="${payment.id}">
                <i data-lucide="rotate-ccw" class="w-4 h-4 pointer-events-none"></i>
              </button>
            ` : ''}
            <button class="p-1 text-gray-600 hover:text-gray-900 touch-manipulation" data-action="download-receipt" data-id="${payment.id}">
              <i data-lucide="download" class="w-4 h-4 pointer-events-none"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getStatusClass(status) {
    const classes = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getMethodIcon(method) {
    const icons = {
      cash: 'banknote',
      card: 'credit-card',
      upi: 'smartphone',
      wallet: 'wallet'
    };
    return icons[method] || 'credit-card';
  }
}
