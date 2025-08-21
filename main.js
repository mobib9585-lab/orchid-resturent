import './style.css'
import { RestaurantApp } from './src/app.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = new RestaurantApp();
  app.init();
});
