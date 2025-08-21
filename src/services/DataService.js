import { faker } from '@faker-js/faker';

export class DataService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    this.orders = this.generateOrders();
    this.menuItems = this.generateMenuItems();
    this.reviews = this.generateReviews();
    this.staff = this.generateStaff();
    this.payments = this.generatePayments();
  }

  generateOrders() {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `ORD-${1000 + i}`,
      customerName: faker.person.fullName(),
      items: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
        name: faker.food.dish(),
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: parseFloat(faker.commerce.price({ min: 50, max: 500 }))
      })),
      status: faker.helpers.arrayElement(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
      total: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
      orderTime: faker.date.recent({ days: 7 }),
      table: faker.number.int({ min: 1, max: 20 }),
      paymentStatus: faker.helpers.arrayElement(['paid', 'pending', 'failed'])
    }));
  }

  generateMenuItems() {
    const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials'];
    return Array.from({ length: 25 }, (_, i) => ({
      id: `MENU-${100 + i}`,
      name: faker.food.dish(),
      category: faker.helpers.arrayElement(categories),
      description: faker.food.description(),
      price: parseFloat(faker.commerce.price({ min: 50, max: 800 })),
      image: `https://picsum.photos/300/200?random=${i}`,
      available: faker.datatype.boolean(),
      ingredients: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.food.ingredient()),
      preparationTime: faker.number.int({ min: 5, max: 45 }),
      popularity: faker.number.int({ min: 1, max: 100 })
    }));
  }

  generateReviews() {
    return Array.from({ length: 15 }, (_, i) => ({
      id: `REV-${200 + i}`,
      customerName: faker.person.fullName(),
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      date: faker.date.recent({ days: 30 }),
      orderId: `ORD-${faker.number.int({ min: 1000, max: 1019 })}`,
      response: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      verified: faker.datatype.boolean()
    }));
  }

  generateStaff() {
    const positions = ['Chef', 'Waiter', 'Cashier', 'Manager', 'Kitchen Helper', 'Cleaner'];
    return Array.from({ length: 12 }, (_, i) => ({
      id: `EMP-${300 + i}`,
      name: faker.person.fullName(),
      position: faker.helpers.arrayElement(positions),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      salary: parseFloat(faker.finance.amount({ min: 15000, max: 50000 })),
      hireDate: faker.date.past({ years: 3 }),
      status: faker.helpers.arrayElement(['active', 'inactive', 'on-leave']),
      shift: faker.helpers.arrayElement(['morning', 'evening', 'night']),
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`
    }));
  }

  generatePayments() {
    return Array.from({ length: 30 }, (_, i) => ({
      id: `PAY-${400 + i}`,
      orderId: `ORD-${faker.number.int({ min: 1000, max: 1019 })}`,
      amount: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
      method: faker.helpers.arrayElement(['cash', 'card', 'upi', 'wallet']),
      status: faker.helpers.arrayElement(['completed', 'pending', 'failed', 'refunded']),
      transactionId: faker.string.alphanumeric(12).toUpperCase(),
      date: faker.date.recent({ days: 30 }),
      customerName: faker.person.fullName()
    }));
  }

  getOrders() { return this.orders; }
  getMenuItems() { return this.menuItems; }
  getReviews() { return this.reviews; }
  getStaff() { return this.staff; }
  getPayments() { return this.payments; }

  addMenuItem(itemData) {
    const newItem = {
      id: `MENU-${Date.now()}`,
      name: itemData.name,
      category: itemData.category,
      description: itemData.description,
      price: parseFloat(itemData.price),
      image: `https://picsum.photos/300/200?random=${Date.now()}`,
      available: true,
      ingredients: [],
      preparationTime: parseInt(itemData.preparationTime),
      popularity: 0
    };
    this.menuItems.unshift(newItem);
    return newItem;
  }

  updateMenuItem(itemId, updates) {
    const item = this.menuItems.find(m => m.id === itemId);
    if (item) {
      item.name = updates.name || item.name;
      item.category = updates.category || item.category;
      item.price = parseFloat(updates.price) || item.price;
      item.description = updates.description || item.description;
      item.preparationTime = parseInt(updates.preparationTime) || item.preparationTime;
    }
    return item;
  }
  
  deleteMenuItem(itemId) {
    const index = this.menuItems.findIndex(m => m.id === itemId);
    if (index > -1) this.menuItems.splice(index, 1);
  }

  toggleMenuItemAvailability(itemId) {
    const item = this.menuItems.find(m => m.id === itemId);
    if (item) item.available = !item.available;
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) order.status = status;
  }

  addReviewResponse(reviewId, response) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (review) review.response = response;
  }

  addStaffMember(staffData) {
    const newStaff = {
      id: `EMP-${Date.now()}`,
      name: staffData.name,
      position: staffData.position,
      email: staffData.email,
      phone: staffData.phone,
      salary: parseFloat(staffData.salary),
      hireDate: new Date(staffData.hireDate),
      status: 'active',
      shift: staffData.shift,
      avatar: `https://i.pravatar.cc/150?img=${Date.now()}`
    };
    this.staff.unshift(newStaff);
    return newStaff;
  }

  updateStaff(staffId, updates) {
    const member = this.staff.find(s => s.id === staffId);
    if (member) {
      member.name = updates.name || member.name;
      member.position = updates.position || member.position;
      member.email = updates.email || member.email;
      member.phone = updates.phone || member.phone;
      member.salary = parseFloat(updates.salary) || member.salary;
      member.shift = updates.shift || member.shift;
    }
    return member;
  }

  toggleStaffStatus(staffId) {
    const member = this.staff.find(s => s.id === staffId);
    if (member) {
      if (member.status === 'active') member.status = 'inactive';
      else if (member.status === 'inactive') member.status = 'active';
    }
  }

  initiateRefund(paymentId) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) payment.status = 'refunded';
  }

  getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = this.orders.filter(order => new Date(order.orderTime) >= today);
    const todayPayments = this.payments.filter(payment => new Date(payment.date) >= today && payment.status === 'completed');
    return {
      totalOrders: todayOrders.length,
      totalRevenue: todayPayments.reduce((sum, p) => sum + p.amount, 0),
      avgOrderValue: todayOrders.length > 0 ? todayOrders.reduce((sum, o) => sum + o.total, 0) / todayOrders.length : 0,
      activeStaff: this.staff.filter(s => s.status === 'active').length
    };
  }

  getRecentActivity() {
    const recentOrders = this.orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime)).slice(0, 5);
    const recentReviews = this.reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    return { recentOrders, recentReviews };
  }
}
