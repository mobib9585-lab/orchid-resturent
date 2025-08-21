export class StaffComponent {
  constructor(dataService) {
    this.dataService = dataService;
  }

  render() {
    const staff = this.dataService.getStaff();
    const positions = [...new Set(this.dataService.getStaff().map(member => member.position))];

    return `
      <div class="space-y-4 lg:space-y-6">
        <!-- Header Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
          <div>
            <h3 class="text-base lg:text-lg font-semibold text-gray-800">Staff Management</h3>
            <p class="text-sm lg:text-base text-gray-600">Manage restaurant employees and their information</p>
          </div>
          <button class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 touch-manipulation" data-action="open-add-staff-modal">
            <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
            Add Staff Member
          </button>
        </div>

        <!-- Staff Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="users" class="w-5 h-5 lg:w-6 lg:h-6 text-green-600"></i>
            </div>
            <div class="text-xl lg:text-2xl font-bold text-gray-800">${staff.filter(s => s.status === 'active').length}</div>
            <div class="text-xs lg:text-sm text-gray-600">Active Staff</div>
          </div>
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="clock" class="w-5 h-5 lg:w-6 lg:h-6 text-blue-600"></i>
            </div>
            <div class="text-xl lg:text-2xl font-bold text-gray-800">${staff.filter(s => s.status === 'on-leave').length}</div>
            <div class="text-xs lg:text-sm text-gray-600">On Leave</div>
          </div>
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="briefcase" class="w-5 h-5 lg:w-6 lg:h-6 text-purple-600"></i>
            </div>
            <div class="text-xl lg:text-2xl font-bold text-gray-800">${positions.length}</div>
            <div class="text-xs lg:text-sm text-gray-600">Positions</div>
          </div>
          <div class="card text-center p-4 lg:p-6">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <i data-lucide="indian-rupee" class="w-5 h-5 lg:w-6 lg:h-6 text-orange-600"></i>
            </div>
            <div class="text-xl lg:text-2xl font-bold text-gray-800">₹${(staff.reduce((sum, s) => sum + s.salary, 0) / 1000).toFixed(0)}K</div>
            <div class="text-xs lg:text-sm text-gray-600">Total Payroll</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card p-4 lg:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select class="input-field text-sm lg:text-base" id="positionFilter">
                <option value="">All Positions</option>
                ${positions.map(pos => `<option value="${pos}">${pos}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select class="input-field text-sm lg:text-base" id="statusFilter">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <select class="input-field text-sm lg:text-base" id="shiftFilter">
                <option value="">All Shifts</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <input type="text" placeholder="Search staff..." class="input-field pl-10 text-sm lg:text-base" id="searchInput">
                <i data-lucide="search" class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Staff Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          ${staff.map(member => this.renderStaffCard(member)).join('')}
        </div>

        <!-- Add Staff Modal -->
        <div id="addStaffModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Add New Staff Member</h3>
            <form id="addStaffForm" class="space-y-4">
              ${this.renderStaffFormFields(positions)}
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" class="btn-primary flex-1 touch-manipulation">Add Staff Member</button>
                <button type="button" class="btn-secondary touch-manipulation" data-action="close-add-staff-modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Edit Staff Modal -->
        <div id="editStaffModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">Edit Staff Member</h3>
            <form id="editStaffForm" class="space-y-4">
              <input type="hidden" name="id">
              ${this.renderStaffFormFields(positions, false)}
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" class="btn-primary flex-1 touch-manipulation">Save Changes</button>
                <button type="button" class="btn-secondary touch-manipulation" data-action="close-edit-staff-modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
  
  renderStaffFormFields(positions, isAdd = true) {
    return `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" required class="input-field text-sm lg:text-base" name="name">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
        <select required class="input-field text-sm lg:text-base" name="position">
          ${positions.map(pos => `<option value="${pos}">${pos}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" required class="input-field text-sm lg:text-base" name="email">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input type="tel" required class="input-field text-sm lg:text-base" name="phone">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
        <input type="number" required min="0" class="input-field text-sm lg:text-base" name="salary">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Shift</label>
        <select required class="input-field text-sm lg:text-base" name="shift">
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>
      ${isAdd ? `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
        <input type="date" required class="input-field text-sm lg:text-base" name="hireDate">
      </div>` : ''}
    `;
  }

  renderStaffCard(member) {
    const hireDate = new Date(member.hireDate).toLocaleDateString();
    const statusClass = this.getStatusClass(member.status);
    
    return `
      <div class="card hover:shadow-md transition-shadow duration-200 p-4 lg:p-6">
        <div class="flex items-center space-x-3 lg:space-x-4 mb-4">
          <img src="${member.avatar}" alt="${member.name}" class="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0">
          <div class="min-w-0 flex-1">
            <h4 class="text-base lg:text-lg font-semibold text-gray-800 truncate">${member.name}</h4>
            <p class="text-sm lg:text-base text-gray-600 truncate">${member.position}</p>
            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClass}">
              ${member.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div class="space-y-2 lg:space-y-3">
          <div class="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
            <i data-lucide="mail" class="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0"></i>
            <span class="truncate">${member.email}</span>
          </div>
          <div class="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
            <i data-lucide="phone" class="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0"></i>
            <span>${member.phone}</span>
          </div>
          <div class="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
            <i data-lucide="calendar" class="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0"></i>
            <span>Joined ${hireDate}</span>
          </div>
          <div class="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
            <i data-lucide="clock" class="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0"></i>
            <span class="capitalize">${member.shift} Shift</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs lg:text-sm text-gray-600">Monthly Salary</span>
            <span class="font-semibold text-gray-800 text-sm lg:text-base">₹${member.salary.toLocaleString()}</span>
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <button class="flex-1 btn-primary text-xs lg:text-sm py-2 touch-manipulation" data-action="open-edit-staff-modal" data-id="${member.id}">
              <i data-lucide="edit" class="w-3 h-3 lg:w-4 lg:h-4 mr-1 pointer-events-none"></i>
              Edit
            </button>
            <button class="px-3 py-2 text-xs lg:text-sm ${member.status === 'active' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} rounded touch-manipulation" 
                    data-action="toggle-staff-status" data-id="${member.id}">
              ${member.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <button class="px-3 py-2 text-xs lg:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 touch-manipulation" data-action="view-staff-details" data-id="${member.id}">
              <i data-lucide="eye" class="w-3 h-3 lg:w-4 lg:h-4 pointer-events-none"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getStatusClass(status) {
    const classes = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
