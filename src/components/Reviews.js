export class ReviewsComponent {
  constructor(dataService) {
    this.dataService = dataService;
  }

  render() {
    const reviews = this.dataService.getReviews();
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const ratingDistribution = this.calculateRatingDistribution(reviews);

    return `
      <div class="space-y-4 lg:space-y-6">
        <!-- Header -->
        <div>
          <h3 class="text-base lg:text-lg font-semibold text-gray-800">Customer Reviews</h3>
          <p class="text-sm lg:text-base text-gray-600">Monitor and respond to customer feedback</p>
        </div>

        <!-- Review Summary -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div class="card text-center p-4 lg:p-6">
            <div class="mb-4">
              <div class="text-3xl lg:text-4xl font-bold text-gray-800">${avgRating.toFixed(1)}</div>
              <div class="flex items-center justify-center mt-2">
                ${Array.from({ length: 5 }, (_, i) => `
                  <i data-lucide="star" class="w-4 h-4 lg:w-5 lg:h-5 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>
                `).join('')}
              </div>
              <p class="text-xs lg:text-sm text-gray-600 mt-2">Based on ${reviews.length} reviews</p>
            </div>
          </div>

          <div class="card p-4 lg:p-6">
            <h4 class="font-semibold text-gray-800 mb-4 text-sm lg:text-base">Rating Distribution</h4>
            <div class="space-y-2">
              ${Array.from({ length: 5 }, (_, i) => {
                const stars = 5 - i;
                const count = ratingDistribution[stars] || 0;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return `
                  <div class="flex items-center space-x-2 lg:space-x-3">
                    <span class="text-xs lg:text-sm font-medium w-6 lg:w-8">${stars}★</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div class="bg-yellow-400 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <span class="text-xs lg:text-sm text-gray-600 w-6 lg:w-8">${count}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="card p-4 lg:p-6">
            <h4 class="font-semibold text-gray-800 mb-4 text-sm lg:text-base">Quick Stats</h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm lg:text-base">Verified Reviews</span>
                <span class="font-medium text-sm lg:text-base">${reviews.filter(r => r.verified).length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm lg:text-base">Responded To</span>
                <span class="font-medium text-sm lg:text-base">${reviews.filter(r => r.response).length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm lg:text-base">This Month</span>
                <span class="font-medium text-sm lg:text-base">${reviews.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card p-4 lg:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select class="input-field text-sm lg:text-base" id="ratingFilter">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select class="input-field text-sm lg:text-base" id="statusFilter">
                <option value="">All Reviews</option>
                <option value="responded">Responded</option>
                <option value="pending">Pending Response</option>
                <option value="verified">Verified</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <input type="date" class="input-field text-sm lg:text-base" id="dateFilter">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <input type="text" placeholder="Search reviews..." class="input-field pl-10 text-sm lg:text-base" id="searchInput">
                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="space-y-4">
          ${reviews.map(review => this.renderReview(review)).join('')}
        </div>
      </div>
    `;
  }

  renderReview(review) {
    const formattedDate = new Date(review.date).toLocaleDateString();
    
    return `
      <div class="card p-4 lg:p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-primary-600 font-medium text-sm lg:text-base">${review.customerName.charAt(0)}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <h4 class="font-medium text-gray-800 text-sm lg:text-base truncate">${review.customerName}</h4>
                ${review.verified ? '<i data-lucide="shield-check" class="w-4 h-4 text-green-500 flex-shrink-0" title="Verified Customer"></i>' : ''}
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                <div class="flex">
                  ${Array.from({ length: 5 }, (_, i) => `
                    <i data-lucide="star" class="w-3 h-3 lg:w-4 lg:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}"></i>
                  `).join('')}
                </div>
                <span class="text-xs lg:text-sm text-gray-500">• ${formattedDate}</span>
                <span class="text-xs lg:text-sm text-gray-500">• Order #${review.orderId}</span>
              </div>
            </div>
          </div>
          <div class="flex space-x-2 flex-shrink-0">
            ${!review.response ? `
              <button class="px-3 py-1 text-xs lg:text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200 touch-manipulation" data-action="respond-to-review" data-id="${review.id}">
                <i data-lucide="reply" class="w-3 h-3 lg:w-4 lg:h-4 mr-1 pointer-events-none"></i>
                Respond
              </button>
            ` : ''}
            <button class="px-3 py-1 text-xs lg:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 touch-manipulation">
              <i data-lucide="more-horizontal" class="w-3 h-3 lg:w-4 lg:h-4"></i>
            </button>
          </div>
        </div>

        <div class="mb-4">
          <p class="text-gray-700 text-sm lg:text-base">${review.comment}</p>
        </div>

        ${review.response ? `
          <div class="bg-gray-50 rounded-lg p-3 lg:p-4 border-l-4 border-primary-500">
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-5 h-5 lg:w-6 lg:h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <i data-lucide="building" class="w-3 h-3 text-primary-600"></i>
              </div>
              <span class="text-xs lg:text-sm font-medium text-gray-800">ORCHID Restaurant Response</span>
            </div>
            <p class="text-gray-700 text-xs lg:text-sm">${review.response}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  calculateRatingDistribution(reviews) {
    const distribution = {};
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  }
}
