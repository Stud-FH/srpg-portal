import { Routes } from '@angular/router';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';

export const MerchRoutes: Routes = [
  {
    path: 'shop',
    title: 'Shop',
    component: ShopPageComponent,
  },
];
