import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CompartidoService } from 'src/app/compartido/compartido.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  displayedColumns: string [] = [
    'name',
    'serialNumber',
    'description',
    'status',
    'acciones'
  ];

 dataInicial: ProductService []= [];
  dataSource = new MatTableDataSource(this.dataInicial);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(private _productService: ProductService,
              private _compartidoService: CompartidoService,
              private router: Router){

  }

  ngOnInit(): void {
    this.obtenerProductos();

  }
  nuevoProducto(){
    this.router.navigate(['/layout/product']);
  }



obtenerProductos(){
    this._productService.lista().subscribe({
      next: (data) => {
        console.log("Respuesta completa de Orden:", data);
        if (data.isExitoso) {
          console.log("Data Product", data.resultado); // Verifica si es un array
          this.dataSource = new MatTableDataSource(data.resultado);
          this.dataSource.paginator = this.paginacionTabla;
        } else {
          this._compartidoService.mostrarAlerta(
            'No se encontraron datos',
            'Advertencia!'
          );
        }
      },
      error: (e) => {
        console.error("Error en Obtener Productos:", e);
      }
   });
  }


}
