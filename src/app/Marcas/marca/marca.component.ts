import { Component, OnInit, ViewChild } from '@angular/core';
import { CompartidoService } from 'src/app/compartido/compartido.service';
import { MarcaService } from '../services/marca.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Marca } from '../Interfaces/marca';
import { Category } from 'src/app/Categoria/interfaces/category';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.scss']
})
export class MarcaComponent implements OnInit{
marcas: Marca[] = [];
dataInicial: MarcaComponent []= [];
dataSource = new MatTableDataSource(this.dataInicial);
@ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _marcaService: MarcaService,
    private _compartidoService: CompartidoService) {}

  ngOnInit(): void {
    this.obtenerMarcas();
  }

  obtenerMarcas(){
    this._marcaService.lista().subscribe({
      next: (data) => {
          if(data.isExitoso)
          {
            this.dataSource = new MatTableDataSource(data.resultado);
            this.dataSource.paginator = this.paginacionTabla;
            console.log("Marcas: ", data.resultado);
          } else
            this._compartidoService.mostrarAlerta(
              'No se  encontraron datos',
              'Advertencia!'
            );
        },
          error: (e) => {}
    });
  }
}
