import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {

  product:any ={};

  constructor(
    private producSe: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.producSe.getProduct(this.route.snapshot.params['id']).subscribe(data => {
      this.product = data;
    });
  }



  updateproduct(){
    this.producSe.updateProd(this.product).subscribe(data =>{
      this.navigateToDetail();
    });
  }

  cancelChange(){
    this.navigateToDetail();
  }

  navigateToDetail(){
    this.router.navigate(['/products', this.route.snapshot.params['id']]);
  }
}
